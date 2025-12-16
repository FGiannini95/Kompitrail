// api.js
// Unified API base configuration for both development and production.
//
// - In production, calls go through Nginx proxy at `/api`.
// - In development, the value of VITE_API_BASE (from .env.development)
//   will point to http://127.0.0.1:3001 so you hit your local backend directly.

export const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || "/api";

export const USERS_URL = `${API_BASE}/users`;
export const MOTORBIKES_URL = `${API_BASE}/motorbikes`;
export const ROUTES_URL = `${API_BASE}/routes`;
export const IMAGES_URL = `${API_BASE}/images`;
export const AUTH_URL = `${API_BASE}/auth`;
export const CHAT_URL = `${API_BASE}/chat`;
