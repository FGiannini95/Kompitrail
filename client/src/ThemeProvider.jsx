import React, { useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeProvider = ({ children, mode = "light" }) => {
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode,
        kompitrail: {
          card: mode === "light" ? "#eeeeee" : "#2b2b2b",
          page: mode === "light" ? "#fafafa" : "#121212",
        },
      },
    });

    // minimal overrides for TextField
    return createTheme(baseTheme, {
      components: {
        // Change label color when TextField is focused
        MuiInputLabel: {
          styleOverrides: {
            outlined: {
              "&.Mui-focused": {
                color: baseTheme.palette.text.primary,
              },
            },
          },
        },

        // Change outlined color
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              // Focused border (click or TAB)
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: baseTheme.palette.text.primary,
              },

              // Chrome/Google autofill background
              "& input:-webkit-autofill": {
                WebkitBoxShadow: `0 0 0 100px ${baseTheme.palette.kompitrail.card} inset`,
                WebkitTextFillColor: baseTheme.palette.text.primary,
                transition: "background-color 5000s ease-in-out 0s",
              },
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline applies global resets using the current theme */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
