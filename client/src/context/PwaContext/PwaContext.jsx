import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const PwaContext = createContext();
// Helpful for debugging with ReactDev Tools
PwaContext.displayName = "PwaContext";

export const PwaProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // This event is fired only on supported browser (No iOS or Safari)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("[PWA] beforeinstallprompt event captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // This function manually triggers the native PWA installation prompt.
  // It will be used when the user clicks “Install app”
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { outcome: "dismissed" };
    }

    const promptEvent = deferredPrompt;
    setDeferredPrompt(null);
    setIsInstallable(false);

    // Show the browser's native install prompt
    promptEvent.prompt();

    // Wait for the user's choice
    const { outcome } = await promptEvent.userChoice;
    console.log("[PWA] User install choice:", outcome);

    return { outcome };
  }, [deferredPrompt]);

  const value = {
    isInstallable,
    deferredPrompt,
    triggerInstall,
  };

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export const usePwa = () => {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    throw new Error("usePWA must be used within PWAProvider");
  }
  return ctx;
};
