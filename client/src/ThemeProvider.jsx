import React from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

export const ThemeProvider = ({ children, mode = "light" }) => {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Costum styles
          kompitrail: {
            card: mode === "light" ? "#eeeeee" : "#2b2b2b",
            page: mode === "light" ? "#fafafa" : "#121212",
          },
        },
      }),
    [mode]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
