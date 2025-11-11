// Priority: redirect query -> sessionStorage -> /home.
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../routes/routes";

import { clearRedirectTarget } from "../auth/redirectTarget";
import { useRedirectParam } from "./useRedirectParam";

export const usePostAuthRedirect = () => {
  const navigate = useNavigate();
  const { redirectValue } = useRedirectParam();

  const handlePostAuthRedirect = () => {
    // IsAuthOk && isSafe ? redirectValue : /home
    const target =
      typeof redirectValue === "string" && redirectValue.startsWith("/")
        ? redirectValue
        : RoutesString.home;

    // Navigate once and clear the stored redirect to avoid loops
    navigate(target, { replace: true });
    clearRedirectTarget();
  };

  return { handlePostAuthRedirect };
};
