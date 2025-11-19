// Priority: redirect query -> sessionStorage -> /home.
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../routes/routes";

import { clearRedirectTarget } from "../auth/redirectTarget";
import { useRedirectParam } from "./useRedirectParam";
import { useContext, useEffect, useRef } from "react";
import { KompitrailContext } from "../context/KompitrailContext";

export const usePostAuthRedirect = () => {
  const navigate = useNavigate();
  const { redirectValue } = useRedirectParam();
  const { token, user } = useContext(KompitrailContext);

  const pendingRef = useRef(false);
  const targetRef = useRef(null);

  const handlePostAuthRedirect = () => {
    // IsAuthOk && isSafe ? redirectValue : /home
    const safeTarget =
      typeof redirectValue === "string" && redirectValue.startsWith("/")
        ? redirectValue
        : RoutesString.home;

    targetRef.current = safeTarget;
    pendingRef.current = true;
  };

  useEffect(() => {
    if (!pendingRef.current) return;
    if (!targetRef.current) return;

    navigate(targetRef.current, { replace: true });
    clearRedirectTarget();

    // Reset internal flag
    pendingRef.current = false;
    targetRef.current = null;
  }, [token, user, navigate]);

  return { handlePostAuthRedirect };
};
