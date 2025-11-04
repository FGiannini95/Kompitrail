// api.js
// - In production (served by Nginx), we call the same-origin proxy at `/api`.
// - In development, you can override with Vite by defining VITE_API_BASE in .env
//   (e.g. VITE_API_BASE=/api or http://127.0.0.1:3001). If not set, we default
//   to '/api' so it works out of the box behind Nginx.

export const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || "/api";

export const USERS_URL = "http://localhost:3000/users";
export const MOTORBIKES_URL = "http://localhost:3000/motorbikes";
export const ROUTES_URL = "http://localhost:3000/routes";
