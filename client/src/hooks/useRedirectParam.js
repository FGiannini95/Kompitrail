import { useLocation } from "react-router-dom";
import { getRedirectTarget } from "../auth/redirectTarget";

// Build a safe redirect query string from a path value.
export const buildRedirectQuery = (redirectValue) => {
  if (!redirectValue || typeof redirectValue !== "string") return "";
  return `?redirect=${encodeURIComponent(redirectValue)}`;
};

// Read and propagate a redirect parameter across pages
// Reads ?redirect from the current URL or falls back to sessionStorage (getRedirectTarget) if the query is missing.
export const useRedirectParam = ({ useStorageFallback = true } = {}) => {
  const location = useLocation();

  // Extract ?redirect from current URL
  const searchParams = new URLSearchParams(location.search);
  const redirectParams = searchParams.get("redirect");

  // Fallback: if no query param, try sessionStorage
  const storeRedirect = useStorageFallback ? getRedirectTarget() : null;
  const redirectValue = redirectParams || storeRedirect || "";

  // Ready-to-append query string (e.g., "?redirect=%2Froute%2F13")
  const redirectQuery = buildRedirectQuery(redirectValue);

  // Build a URL by appending the redirect query if present.
  // Example: buildUrl("/login") -> "/login?redirect=%2Froute%2F13"
  const buildUrl = (basePath) => {
    if (typeof basePath !== "string" || basePath.length === 0) return basePath;
    return redirectQuery ? `${basePath}${redirectQuery}` : basePath;
  };

  //Navigate convenience: wraps react-router's navigate with the redirect query.
  const navigateWithRedirect = (navigate, basePath, options) => {
    const url = buildUrl(basePath);
    return navigate(url, options);
  };

  return {
    redirectValue,
    redirectQuery,
    buildUrl,
    navigateWithRedirect,
  };
};
