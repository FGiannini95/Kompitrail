import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { KompitrailProvider } from "../src/context/KompitrailContext";
import { ThemeProvider } from "./ThemeProvider";
import { GlobalRouter } from "./routes/GlobalRouter";
import { getLocalStorage, saveLocalStorage } from "./helpers/localStorageUtils";

const THEME_STORAGE_KEY = "kompitrailTheme";

export function App() {
  // The useTheme hook in Material-UI is used to access the overall theme of the application, which includes design settings such as breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const storedMode = getLocalStorage(THEME_STORAGE_KEY);

    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
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
            <GlobalRouter toggleMode={toggleMode} mode={mode} />
          </KompitrailProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}
