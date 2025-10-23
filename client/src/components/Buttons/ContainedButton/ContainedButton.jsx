import React from "react";
import { Button } from "@mui/material";

export const ContainedButton = ({ onClick, text, icon }) => {
  return (
    <Button
      type="button"
      variant="contained"
      fullWidth
      onClick={onClick}
      sx={{
        color: "black",
        boxShadow: "none",
        backgroundColor: "#eeeeee",
        "&:hover": { backgroundColor: "#dddddd" },
      }}
    >
      {text}
      {icon}
    </Button>
  );
};
