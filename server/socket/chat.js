const path = require("path");
const Contract = require(path.resolve(
  __dirname,
  "../../shared/chat-contract/index"
));
const { EVENTS } = Contract;

// Registers all Socket.IO chat events.
module.exports = (io) => {
  io.on("connection", (socket) => {
    // Join a room (client passes { chatId })
    socket.on(EVENTS.C2S.ROOM_JOIN, ({ chatId, user }) => {
      if (!chatId) return;

      // Keep info to reuse in leave
      const displayName = user?.name || "Un usuario";
      socket.data.user = { id: user?.id || null, name: displayName };

      // Subscribe this socket to the room (a channel)
      socket.join(chatId);

      // System line for the joiner
      socket.emit(EVENTS.S2C.MESSAGE_NEW, {
        chatId,
        message: {
          id: `sys-${Date.now()}-self-join`,
          chatId,
          userId: "system",
          text: "Has entrado en la chat",
          createdAt: new Date().toISOString(),
        },
      });

      // System line for everyone else in the room
      socket.to(chatId).emit(EVENTS.S2C.MESSAGE_NEW, {
        chatId,
        message: {
          id: `sys-${Date.now()}-self-join`,
          chatId,
          userId: "system",
          text: `${displayName} se ha unido al chat`,
          createdAt: new Date().toISOString(),
        },
      });

      console.log(`[room] ${socket.id} joined ${chatId}`);
    });

    // Leave a room (client passes { chatId })
    socket.on(EVENTS.C2S.ROOM_LEAVE, ({ chatId }) => {
      if (!chatId) return;

      const displayName = socket.data?.user?.name || "Un usuario";

      // System line for the leaver
      socket.emit(EVENTS.S2C.MESSAGE_NEW, {
        chatId,
        message: {
          id: `sys-${Date.now()}-self-leave`,
          chatId,
          userId: "system",
          text: "Has abandonado el chat",
          createdAt: new Date().toISOString(),
        },
      });

      // System line for everyone else in the room
      socket.to(chatId).emit(EVENTS.S2C.MESSAGE_NEW, {
        chatId,
        message: {
          id: `sys-${Date.now()}-others-leave`,
          chatId,
          userId: "system",
          text: `${displayName} ha abandonado el chat`,
          createdAt: new Date().toISOString(),
        },
      });

      // Unsubscribe from the room
      socket.leave(chatId);
      console.log(`[room] ${socket.id} left ${chatId}`);
    });

    // Debug healthcheck: client emits "ping" → we reply "pong" to that same client.
    socket.on("ping", (payload) => {
      socket.emit("pong", { echo: payload?.echo ?? null, ts: Date.now() });
    });
  });
};

/*
Send chat message to the room.
Typing indicator.
Read receipts (double check).
Payload: { routeId, lastSeenMessageId }
*/
