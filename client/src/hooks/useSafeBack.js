import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useSafeBack = (fallbackPath = "/") => {
  const navigate = useNavigate();

  // Safe back handler with fallback to home.
  const handleBack = useCallback(() => {
    // Check if the tab has history to go back to
    const canGoBack =
      typeof window !== "undefined" &&
      window.history &&
      window.history.state &&
      typeof window.history.state.idx === "number" &&
      window.history.state.idx > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  }, [navigate, fallbackPath]);

  return handleBack;
};
