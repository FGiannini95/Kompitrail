// server/socket/chat.js
const path = require("path");
const Contract = require(path.resolve(__dirname, "../../shared/chat-contract"));
const { EVENTS } = Contract;

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on(EVENTS.C2S.ROOM_JOIN, ({ chatId, user }) => {
      if (!chatId) return;
      const displayName = user?.name || "Un usuario";
      socket.data.user = { id: user?.id || null, name: displayName };
      socket.join(chatId);

      // Self-only confirmation line for the joiner
      socket.emit(EVENTS.S2C.MESSAGE_NEW, {
        chatId,
        message: {
          id: `sys-${Date.now()}-self-join`,
          chatId,
          userId: "system",
          text: "Has entrado en el chat",
          createdAt: new Date().toISOString(),
        },
      });
    });

    socket.on(EVENTS.C2S.ROOM_LEAVE, ({ chatId }) => {
      if (!chatId) return;
      // Self-only confirmation line for the leaver
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
      socket.leave(chatId);
    });

    // Debug pourpuse
    socket.on("ping", (payload) => {
      socket.emit("pong", { echo: payload?.echo ?? null, ts: Date.now() });
    });
  });
};
