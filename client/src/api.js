// api.js
// Unified API base configuration for both development and production.
//
// - In production, calls go through Nginx proxy at `/api`.
// - In development, auto-detects if accessing via network IP for mobile testing

const getApiBase = () => {
  // If we're accessing via network IP, use network IP for API too
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "192.168.0.43"
  ) {
    return "http://192.168.0.43:3000";
  }

  // Otherwise use env variable (localhost for dev, /api for prod)
  return (
    (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || "/api"
  );
};

export const API_BASE = getApiBase();

export const USERS_URL = `${API_BASE}/users`;
export const MOTORBIKES_URL = `${API_BASE}/motorbikes`;
export const ROUTES_URL = `${API_BASE}/routes`;
export const IMAGES_URL = `${API_BASE}/images`;
export const AUTH_URL = `${API_BASE}/auth`;
export const CHAT_URL = `${API_BASE}/chat`;
export const BOT_URL = `${API_BASE}/chatbot`;
