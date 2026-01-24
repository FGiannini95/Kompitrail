import React from "react";
import { Box } from "@mui/material";

export const WaypointNumberBadge = ({ number, size = 20 }) => {
  return (
    <Box
      sx={(theme) => ({
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        border: `1px solid ${theme.palette.text.primary}`,
        flexShrink: 0,
      })}
    >
      {number}
    </Box>
  );
};
