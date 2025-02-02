import React, { useState } from "react";

// MUI
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// MUI-ICONS
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useLocation } from "react-router-dom";
import { RoutesString } from "../../routes/routes";

export const EmptyState = () => {
  const location = useLocation();

  const message =
    location.pathname === RoutesString.motorbike
      ? "Aún no has añadido ninguna moto."
      : location.pathname === RoutesString.route
        ? "Aún no has creado ninguna ruta."
        : "Ninguna ruta disponibles.";

  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: "#eeeeee",
        borderRadius: "20px",
        p: 3,
        textAlign: "center",
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <ErrorOutlineIcon sx={{ fontSize: 100 }} />
          <Typography variant="body2">{message}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
