// Registers all Socket.IO chat events.
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("[socket] connected", socket.id);

    socket.on("ping", (payload) => {
      socket.emit("pong", { echo: payload?.echo ?? null, ts: Date.now() });
    });

    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected", socket.id, reason);
    });
  });
};

//module.exports = function registerChatSockets(io) {
// Fired for every new WebSocket connection
// TIP: if you use auth, decode JWT here and attach userId to socket.data
/**
 * Join a route chat room (room name = `room:<routeId>`).
 * Payload: { routeId }
 * - Validate the user can access the route (membership)
 * - socket.join(room)
 * - Optionally emit a system message "X joined the chat"
 */
/**
 * Leave the route chat room.
 * Payload: { routeId }
 * - socket.leave(room)
 * - Optionally emit a system message "X left the chat"
 */
/**
 * Send chat message to the room.
 * Payload: { routeId, body }
 * - Validate not locked, user is participant
 * - Persist to DB (chat_message)
 * - Broadcast to the room with the saved messageId/timestamp
 */
/**
 * Typing indicator.
 * Payload: { routeId, isTyping }
 * - Broadcast to others in the same room (no DB)
 */
/**
 * Read receipts (double check).
 * Payload: { routeId, lastSeenMessageId }
 * - Upsert chat_room_read for this user
 * - Broadcast to the room so others update checks
 */
/**
 * Helper (optional): expose a function to lock a room when a route is deleted.
 * You can call this from an Express route by doing: req.app.get("io").emit(...)
 */
