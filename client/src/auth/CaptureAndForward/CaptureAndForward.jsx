import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";
import { setRedirectTarget } from "../redirectTarget";

// Non-protected routes in the tree
const PUBLIC_PATHS = new Set([
  RoutesString.landing,
  RoutesString.login,
  RoutesString.register,
]);

const buildInternalPath = (loc) => {
  // Build "/path?query#hash" from the current location
  const search = loc.search || "";
  const hash = loc.hash || "";

  return `${loc.pathname}${search}${hash}`;
};

const isPublicPath = (pathname) => PUBLIC_PATHS.has(pathname);

export const CaptureAndForward = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user somehow hits a public page through this route, just send to landing
    if (isPublicPath(location.pathname)) {
      navigate(RoutesString.landing, { replace: true });
      return;
    }

    //Save the absolute URL as an internal path in sessionStorage
    if (typeof window !== "undefined" && window.location) {
      setRedirectTarget(window.location.href);
    }

    //Build the redirect query backup and navigate to landing
    const internalPath = buildInternalPath(location);
    // Only encode if it looks like an interna path (starts with "/")
    const searchParams = internalPath.startsWith("/")
      ? `?redirect=${encodeURIComponent(internalPath)}`
      : "";

    navigate(`${RoutesString.landing}${searchParams}`, { replace: true });
  }, [location, navigate]);

  // Render nothing; this component only performs a one-shot redirect
  return null;
};
