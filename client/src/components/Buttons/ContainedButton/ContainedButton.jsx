import React, { forwardRef } from "react";
import { Button } from "@mui/material";

export const ContainedButton = forwardRef(
  ({ onClick, text, icon, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
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
        {...rest}
      >
        {text}
        {icon}
      </Button>
    );
  }
);

ContainedButton.displayName = "ContainedButton";
