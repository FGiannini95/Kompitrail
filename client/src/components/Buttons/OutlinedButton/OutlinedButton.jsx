import React, { forwardRef } from "react";
import { Button } from "@mui/material";

export const OutlinedButton = forwardRef(
  ({ onClick, text, icon, sx, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
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
          ...sx,
        }}
        {...rest}
      >
        {text}
        {icon}
      </Button>
    );
  }
);

OutlinedButton.displayName = "OutlinedButton";
