import { io } from "socket.io-client";

/**
 * Single socket instance for the whole app.
 * - withCredentials must match your server's CORS config.
 * - transports includes 'websocket' to reduce polling issues in dev.
 */

const getSocketURL = () => {
  // If we're accessing via network IP, use network IP for socket too
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "192.168.0.43"
  ) {
    return "http://192.168.0.43:3000";
  }

  // Otherwise use standard dev/prod logic
  return import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://kompitrail.es";
};

export const socket = io(getSocketURL(), {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
