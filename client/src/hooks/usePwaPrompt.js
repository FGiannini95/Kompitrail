import React, { useEffect, useState, useCallback } from "react";
import { usePwa } from "../context/PwaContext/PwaContext";

import {
  getLocalStorage,
  saveLocalStorage,
  delLocalStorage,
} from "../helpers/localStorageUtils";

const PWA_INSTALL_DISMISSED_KEY = "pwaInstallDismissed";
const PWA_INSTALL_ACCEPTED_KEY = "pwaInstallAccepted";

// This hook decides if the popup should be shown
export const usePwaPrompt = (isAuthenticated) => {
  const { isInstallable, triggerInstall } = usePwa();
  const [IsPwaDialogOpen, setIsPwaDialogOpen] = useState(false);

  // Detect iOS device
  const isIos =
    typeof window != "undefined" &&
    /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isInstallable && !isIos) return;

    // If the user already installed the PWA
    const alreadyAccepted =
      getLocalStorage(PWA_INSTALL_ACCEPTED_KEY) === "true";
    if (alreadyAccepted) return;

    // If the user already dismissed the popup in the past
    const alreadyDismissed =
      getLocalStorage(PWA_INSTALL_DISMISSED_KEY) === "true";
    if (alreadyDismissed) return;

    setIsPwaDialogOpen(true);
  }, [isAuthenticated, isInstallable, isIos]);

  const handleAccept = useCallback(async () => {
    // Android: trigger the native install prompt provided by the browser.
    if (isInstallable) {
      const { outcome } = await triggerInstall();

      if (outcome === "accepted") {
        saveLocalStorage(PWA_INSTALL_ACCEPTED_KEY, "true");
        delLocalStorage(PWA_INSTALL_DISMISSED_KEY);
        setIsPwaDialogOpen(false);
        return { outcome };
      }

      // If the user saw the native prompt but dismissed it,
      saveLocalStorage(PWA_INSTALL_DISMISSED_KEY, "true");
      setIsPwaDialogOpen(false);
      return { outcome };
    }

    // iOS: close dialog
    saveLocalStorage(PWA_INSTALL_DISMISSED_KEY, "true");
    setIsPwaDialogOpen(false);
    return { outcome: "dismissed" };
  }, [triggerInstall, isInstallable]);

  const handleDismiss = useCallback(() => {
    saveLocalStorage(PWA_INSTALL_DISMISSED_KEY, "true");
    setIsPwaDialogOpen(false);
  }, []);

  return {
    IsPwaDialogOpen,
    handleAccept,
    handleDismiss,
    isIos,
  };
};
