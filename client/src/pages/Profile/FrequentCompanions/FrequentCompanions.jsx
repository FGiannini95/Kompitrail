import React from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useFrequentCompanions } from "../../../hooks/useFrequentCompanions";
import { CardPlaceholder } from "../../../components/CardPlaceholder/CardPlaceholder";

export const FrequentCompanions = () => {
  const { companions = [], loading, error } = useFrequentCompanions();

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

  if (!Array.isArray(companions) || companions.length === 0) {
    return <CardPlaceholder text={"Aún no tienes compañeros de viaje."} />;
  }

  return (
    <Box>
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
            <Avatar
            //src={companion.img}
            //alt={companion.name}
            />
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
