/**
 * getMessages(routeId, { offset, limit: 20 }) → returns last 20, older on scroll. getParticipants(routeId) (optional). REST is for history & pagination; sockets are for live.
 */

import { io } from "socket.io-client";

/**
 * Single socket instance for the whole app.
 * - withCredentials must match your server's CORS config.
 * - transports includes 'websocket' to reduce polling issues in dev.
 */

export const socket = io("https://kompitrail.es", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
