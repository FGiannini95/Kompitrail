import React, { forwardRef } from "react";
import { Button } from "@mui/material";

export const OutlinedButton = forwardRef(
  ({ onClick, text, icon, sx, children, ...rest }, ref) => {
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
          borderWidth: "3px",
          "&:hover": {
            backgroundColor: theme.palette.kompitrail.card,
            borderColor: theme.palette.kompitrail.card,
            borderWidth: "3px",
          },
          ...sx,
        })}
        {...rest}
      >
        {/* If children are provided, render them. Otherwise fallback to text + icon */}
        {children ?? (
          <>
            {text}
            {icon}
          </>
        )}
      </Button>
    );
  }
);

OutlinedButton.displayName = "OutlinedButton";
