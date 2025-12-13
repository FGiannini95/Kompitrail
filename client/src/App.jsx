import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import i18n from "./i18n";

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { KompitrailProvider } from "../src/context/KompitrailContext";
import { ThemeProvider } from "./ThemeProvider";
import { PwaProvider } from "./context/PwaContext/PwaContext";
import { GlobalRouter } from "./routes/GlobalRouter";
import { getLocalStorage, saveLocalStorage } from "./helpers/localStorageUtils";

const THEME_STORAGE_KEY = "kompitrailTheme";
const LANGUAGE_STORAGE_KEY = "kompitrailLanguage";

export function App() {
  // The useTheme hook in Material-UI is used to access the overall theme of the application, which includes design settings such as breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mode, setMode] = useState("light");
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    const storedMode = getLocalStorage(THEME_STORAGE_KEY);
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
    }

    const storedLanguage = getLocalStorage(LANGUAGE_STORAGE_KEY);
    if (
      storedLanguage === "es" ||
      storedLanguage === "en" ||
      storedLanguage === "it"
    ) {
      setLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    } else {
      i18n.changeLanguage("es");
    }
  }, []);

  // Toggle theme and persist it in localStorage
  const toggleMode = () => {
    setMode((prev) => {
      const nextMode = prev === "light" ? "dark" : "light";

      // Persist the new mode in localStorage
      saveLocalStorage(THEME_STORAGE_KEY, nextMode);

      return nextMode;
    });
  };

  // Select language and persist it in localStorage
  const changeLanguage = (nextLanguage = "es" | "en" | "it") => {
    // Ignore invalid values
    if (!["es", "en", "it"].includes(nextLanguage)) return;

    setLanguage(nextLanguage);

    // Persist the new language in localStorage
    saveLocalStorage(LANGUAGE_STORAGE_KEY, nextLanguage);

    i18n.changeLanguage(nextLanguage);
  };

  if (!isMobile) {
    return (
      <Typography align="center">
        Esta aplicación sólo está disponible en dispositivos móviles
      </Typography>
    );
  }

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ThemeProvider mode={mode}>
          <KompitrailProvider>
            <PwaProvider>
              <GlobalRouter
                toggleMode={toggleMode}
                mode={mode}
                language={language}
                changeLanguage={changeLanguage}
              />
            </PwaProvider>
          </KompitrailProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}
