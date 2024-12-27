import React from "react";

// MUI
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { KompitrailProvider } from "../context/KompitrailContext";
import { GlobalRouter } from "./routes/GlobalRouter";
import { ThemeKompitrail } from "./ThemeKompitrail";

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

  return (
    <>
      <ThemeKompitrail>
        <KompitrailProvider>
          <GlobalRouter />
        </KompitrailProvider>
      </ThemeKompitrail>
    </>
  );
}
