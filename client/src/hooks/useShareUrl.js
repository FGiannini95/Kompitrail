import { useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import { RoutesString } from "../routes/routes";

export const useShareUrl = ({ mode, otherUserId, currentUserId, routeId }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Build a canonical share URL that ALWAYS contains the user id.
  // If we're viewing someone else: use that id.
  // If we're viewing our own profile at /profile: use currentUser.user_id.
  const shareUrl = useMemo(() => {
    const origin = window.location.origin;

    if (mode === "route") {
      if (!routeId) return window.location.href;
      const path = generatePath(RoutesString.routeDetail, {
        id: String(routeId),
      });
      return `${origin}${path}`;
    }

    if (mode === "profile") {
      const id = otherUserId ?? currentUserId;
      if (!id) return window.location.href;
      const path = generatePath(RoutesString.otherProfile, {
        id: String(id),
      });
      return `${origin}${path}`;
    }
  }, [mode, routeId, otherUserId, currentUserId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar la URL:", error);
    }
  };

  return { isCopied, handleShare };
};
