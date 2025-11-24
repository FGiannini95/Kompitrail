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
        }
      );
    });
  }

  // When a client connect
  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

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
      console.log(`${displayName} joined room ${chatId}`);

      // Find related chat_room_id in DB
      const chatRoomId = await getChatRoomIdByRoute(chatId);
      if (!chatRoomId) return;

      // Check if the "enter" system message already exists for this (room,user)
      const checkSql = `
        SELECT chat_message_id, created_at
        FROM chat_message
        WHERE chat_room_id = ? AND user_id = ?
          AND is_system = 1 AND body LIKE '%entrado en el chat'
        LIMIT 1
      `;

      connection.query(checkSql, [chatRoomId, userId], (errCheck) => {
        if (errCheck) {
          console.error("Check enter failed", errCheck);
          return;
        }
      });
    });
  });
};
