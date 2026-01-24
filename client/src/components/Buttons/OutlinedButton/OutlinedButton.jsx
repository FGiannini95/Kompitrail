import React, { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";

export const OutlinedButton = forwardRef(
  ({ onClick, text, icon, sx, children, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <Button
        ref={ref}
        type="button"
        variant="outlined"
        fullWidth
        onClick={onClick}
        style={{
          border: `2px solid ${theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"}`,
        }}
        sx={(theme) => ({
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.kompitrail.card,
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
