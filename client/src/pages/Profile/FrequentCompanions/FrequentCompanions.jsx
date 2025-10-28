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

  const isTwoOrLess = companions.length <= 2;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: isTwoOrLess ? "visible" : "auto",
        paddingBottom: 2,
        // Hide scrollbar
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
      }}
    >
      {companions.map((companion) => {
        const photoUrl = companion.img
          ? `http://localhost:3000/images/users/${companion.img}`
          : undefined;

        return (
          <Card
            key={companion.user_id}
            sx={{
              minWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
              maxWidth: isTwoOrLess ? "calc(50% - 8px)" : "calc(45% - 8px)",
              bgcolor: "#eeeeee",
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Avatar
                src={photoUrl}
                alt={`${companion.name ?? ""}`}
                sx={{ width: 56, height: 56 }}
              />
              <Typography fontWeight={600}>{companion.name}</Typography>
              <Typography>{companion.shared_routes} rutas en común</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
