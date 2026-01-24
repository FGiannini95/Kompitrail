import React, { forwardRef } from "react";
import { Button } from "@mui/material";

export const ContainedButton = forwardRef(
  ({ onClick, text, icon, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        variant="contained"
        fullWidth
        onClick={onClick}
        sx={(theme) => ({
          backgroundColor: `${theme.palette.kompitrail.card} !important`,
          color: theme.palette.getContrastText(theme.palette.kompitrail.card),
          boxShadow: "none",
          "&:hover": {
            backgroundColor: theme.palette.kompitrail.page,
            boxShadow: "none",
          },
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

ContainedButton.displayName = "ContainedButton";
