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
        sx={(theme) => ({
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          borderColor: theme.palette.kompitrail.card,
          borderWidth: "2px",
          "&:hover": {
            backgroundColor: theme.palette.kompitrail.card,
            borderColor: theme.palette.kompitrail.card,
            borderWidth: "2px",
          },
          ...sx,
        })}
        {...rest}
      >
        {text}
        {icon}
      </Button>
    );
  }
);

OutlinedButton.displayName = "OutlinedButton";
