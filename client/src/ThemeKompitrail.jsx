import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const themeKompitrail = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#777777", // Change color when the label is focused
          },
        },
      },
    },
  },
});

//todo: add the style for error focused and blur and InputField focused and blur

export const ThemeKompitrail = ({ children }) => {
  return <ThemeProvider theme={themeKompitrail}>{children}</ThemeProvider>;
};
