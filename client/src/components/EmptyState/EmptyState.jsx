import React from "react";
import { useLocation } from "react-router-dom";

import { Box, Card, CardContent, Typography } from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// Utils
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
        width: "100%",
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
