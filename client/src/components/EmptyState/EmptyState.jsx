import React from "react";

// MUI
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// MUI-ICONS
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const EmptyState = () => {
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
          <Typography variant="body2">
            Aún no has añadido ninguna moto.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
