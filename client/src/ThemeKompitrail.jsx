import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const themeKompitrail = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#777777", // Change the color of the label when it is focused
            "&.Mui-error": {
              color: "red", // Change the color if thres is an error
            },
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#aaaaaa",
            },
            "&:hover fieldset": {
              borderColor: "#aaaaaa", // Change the borderColor on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#aaaaaa", // Change the borderColor on focus
            },
            "&.Mui-error fieldset": {
              borderColor: "red", // Change color when there is an error
            },
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
