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
        sx={(theme) => ({
          backgroundColor: theme.palette.kompitrail.card,
          color: theme.palette.getContrastText(theme.palette.kompitrail.card),
          boxShadow: "none",
          "&:hover": {
            backgroundColor: theme.palette.kompitrail.page,
            boxShadow: "none",
          },
        })}
        {...rest}
      >
        {text}
        {icon}
      </Button>
    );
  }
);

ContainedButton.displayName = "ContainedButton";
