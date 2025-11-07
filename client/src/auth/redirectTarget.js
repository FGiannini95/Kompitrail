// src/auth/redirectTarget.js
export const REDIRECT_STORAGE_KEY = "auth.redirectTarget";

// Save a redirect target given an absolute URL (e.g., "http://localhost:5173/route/13")
export const setRedirectTarget = (absoluteUrl, { maxLen = 2048 } = {}) => {
  if (typeof window === "undefined" || !window.sessionStorage) return;

  try {
    const url = new URL(absoluteUrl);

    // Reject if different origin (prevents open-redirects)
    if (url.origin !== window.location.origin) return;

    // Build internal path
    const path = `${url.pathname}${url.search}${url.hash}`;

    // Quick sanity checks
    if (!path.startsWith("/") || path.startsWith("//")) return;
    if (path.length === 0 || path.length > maxLen) return;

    // Persist
    window.sessionStorage.setItem(REDIRECT_STORAGE_KEY, path);
  } catch {
    // Invalid absolute URL or storage not available → ignore
  }
};

// Read the stored redirect target (validated to still look like an internal path)
export const getRedirectTarget = (opts) => {
  const { maxLen = 2048 } = opts && typeof opts === "object" ? opts : {};

  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    const path = window.sessionStorage.getItem(REDIRECT_STORAGE_KEY);
    if (!path) return;
    if (!path.startsWith("/") || path.startsWith("//")) {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return null;
    }
    if (path.length === 0 || path.length > maxLen) {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
      return null;
    }
    return path;
  } catch {
    return null;
  }
};

// Clear the stored redirect target (call immediately after navigating to avoid loops)
export const clearRedirectTarget = () => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore
  }
};
