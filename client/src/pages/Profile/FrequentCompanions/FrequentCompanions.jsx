import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

export const FrequentCompanions = () => {
  const { companions, loading, error } = useFrequentCompanions();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error al cargar la sección</Typography>;
  }

  if (companions.length === 0) {
    return (
      <Typography>
        Aún no tienes compañeros frecuentes. ¡Haz más rutas!
      </Typography>
    );
  }

  return (
    <Box>
      <Typography>Personas con las que viajas más</Typography>
      {companions.map((companion) => (
        <Card
          key={companion.user_id}
          sx={{
            width: "50%",
            bgcolor: "#eeeeee",
            borderRadius: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar />
            <Typography>{companion.name}</Typography>
            <Typography>
              {companion.shared_routes}
              {" rutas en común"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
