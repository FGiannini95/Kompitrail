// server/socket/chat.js
const path = require("path");
const { EVENTS } = require("../../shared/chat-contract");
const connection = require(path.resolve(__dirname, "../config/db.js"));

// This module exports a fn that register all events listener for the chat system
module.exports = (io) => {
  // Utility function to map a route_id (which the FE calls chatId) into its corresponding chat_room_id in the DB
  function getChatRoomIdByRoute(routeId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT chat_room_id FROM chat_room WHERE route_id = ? LIMIT 1",
        [routeId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows && rows.length ? rows[0].chat_room_id : null);
        },
      );
    });
  }

  // When a client connect
  io.on("connection", (socket) => {
    //PING/PONG handshake => The FE periodically sends `ping` to check that connection is alive, BE respond with a `pong`
    socket.on("ping", (payload) => {
      socket.emit("pong", { echo: payload?.echo ?? null, ts: Date.now() });
    });

    // ROOM_JOIN, fired when a user opens a chat
    socket.on(EVENTS.C2S.ROOM_JOIN, async ({ chatId, user }) => {
      if (!chatId) return;

      // Extract user info from payload
      const userId = user?.user_id ?? user?.id ?? null;
      const displayName = user?.name || "Un usuario";
      if (!userId) return;

      // Save minimal user info on the socket
      socket.data.user = { id: userId, name: displayName };

      // Join the logical Socket.IO room
      socket.join(chatId);

      // Find related chat_room_id in DB
      const chatRoomId = await getChatRoomIdByRoute(chatId);
      if (!chatRoomId) return;

      // Check if the "enter" system message already exists for this (room,user)
      const checkSql = `
        SELECT chat_message_id, created_at
        FROM chat_message
        WHERE chat_room_id = ? AND user_id = ?
          AND is_system = 1 AND body LIKE '%ha entrado en el chat'
        LIMIT 1
      `;

      connection.query(checkSql, [chatRoomId, userId], (errCheck, rows) => {
        if (errCheck) {
          console.error("Check enter failed", errCheck);
          return;
        }

        // Self-only confirmation line for the joiner
        const emitSelfEnter = (id, createdAt) => {
          socket.emit(EVENTS.S2C.MESSAGE_NEW, {
            chatId,
            message: {
              id,
              chatId,
              userId: "system",
              text: "Has entrado en el chat",
              isSystem: true,
              createdAt:
                createdAt instanceof Date
                  ? createdAt.toISOString()
                  : new Date(createdAt).toISOString(),
            },
          });
        };

        if (rows && rows.length) {
          // Msg already exists, just send it back to user (reuse same id)
          const { chat_message_id, created_at } = rows[0];
          emitSelfEnter(chat_message_id, created_at);
          return;
        }

        // First entry ever → create the system message in DB (no broadcast here)
        const bodyForOthers = `${displayName} ha entrado en el chat`;
        const insertSql = `
          INSERT INTO chat_message (chat_room_id, user_id, body, is_system, created_at)
          VALUES (?, ?, ?, 1, NOW())
        `;

        connection.query(
          insertSql,
          [chatRoomId, userId, bodyForOthers],
          (errIns, resIns) => {
            if (errIns) {
              console.error("Insert enter failed", errIns);
              return;
            }

            const messageId = resIns.insertId;
            const createdAtIso = new Date().toISOString();

            // Broadcast to everyone in the room
            io.to(chatId).emit(EVENTS.S2C.MESSAGE_NEW, {
              chatId,
              message: {
                id: messageId,
                chatId,
                userId: "system",
                text: bodyForOthers,
                isSystem: true,
                createdAt: createdAtIso,
              },
            });
          },
        );
      });
    });

    // MESSAGE_SEND handler
    socket.on(EVENTS.C2S.MESSAGE_SEND, async ({ chatId, text }) => {
      if (!chatId || !text?.trim()) return;

      // Extract user info from payload
      const userId = socket.data.user?.id;
      const displayName = socket.data.user?.name || "Un usuario";
      if (!userId) return;

      // Find related chat_room_id in DB
      const chatRoomId = await getChatRoomIdByRoute(chatId);
      if (!chatRoomId) return;

      // Save message to DB
      const insertSql = `
        INSERT INTO chat_message (chat_room_id, user_id, body, is_system, created_at)
        VALUES (?, ?, ?, 0, NOW())
      `;

      connection.query(
        insertSql,
        [chatRoomId, userId, text.trim()],
        (err, result) => {
          if (err) {
            console.error("Error saving message:", err);
            return;
          }

          const messageId = result.insertId;
          const createdAt = new Date().toISOString();

          // Broadcast to everyone in the room
          io.to(chatId).emit(EVENTS.S2C.MESSAGE_NEW, {
            chatId,
            message: {
              id: messageId,
              chatId,
              userId,
              text: text.trim(),
              isSystem: false,
              createdAt,
              displayName: displayName,
            },
          });
        },
      );
    });
  });
};
