// Read backend base URL from Vite env at build time.
// On Netlify set: VITE_API_URL = https://kompitrail.onrender.com
// In local dev use client/.env.local with: VITE_API_URL=http://localhost:3000
const API_BASE = (
  import.meta.env?.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
// Remove any trailing slash to avoid double slashes

export const USERS_URL = `${API_BASE}/users`;
export const MOTORBIKES_URL = `${API_BASE}/motorbikes`;
export const ROUTES_URL = `${API_BASE}/routes`;
