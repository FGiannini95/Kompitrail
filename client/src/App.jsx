import React from "react";

// MUI
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { KompitrailProvider } from "../src/context/KompitrailContext";
import { GlobalRouter } from "./routes/GlobalRouter";
import { ThemeKompitrail } from "./ThemeKompitrail";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function App() {
  // The useTheme hook in Material-UI is used to access the overall theme of the application, which includes design settings such as breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <ThemeKompitrail>
          <KompitrailProvider>
            <GlobalRouter />
          </KompitrailProvider>
        </ThemeKompitrail>
      </GoogleOAuthProvider>
    </>
  );
}
