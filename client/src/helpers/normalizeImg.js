import { API_BASE } from "../api";

export const normalizeImg = (img) => {
  if (!img) return undefined;
  if (img === "http" || img === "https") return undefined; // guard for truncated data
  if (/^https?:\/\//i.test(img)) return img; // Google or external image
  return `${API_BASE}/images/users/${img}`; // local filename
};
