import React from "react";
import { Button } from "@mui/material";

export const OutlinedButton = ({ onClick, text, icon }) => {
  return (
    <Button
      type="button"
      variant="outlined"
      fullWidth
      onClick={onClick}
      sx={{
        color: "black",
        borderColor: "#eeeeee",
        borderWidth: "2px",
        "&:hover": {
          borderColor: "#dddddd",
          borderWidth: "2px",
        },
      }}
    >
      {text}
      {icon}
    </Button>
  );
};
