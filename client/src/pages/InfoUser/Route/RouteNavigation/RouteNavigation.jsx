import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export const RouteNavigation = () => {
  const [viewState, setViewState] = useState();
  const [currentPosition, setCurrentPosition] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  const { routeData } = location.state || {};

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Redirect back if no route data
  useEffect(() => {
    if (!routeData) {
      navigate(-1);
      return;
    }

    // Inizialize map on route start
    setViewState({
      latitude: routeData.starting_lat,
      longitude: routeData.starting_lng,
      zoom: 16,
      bearing: 0,
      pitch: 30, // view perspective
    });
  }, [routeData, navigate]);

  const handleExit = () => {
    navigate(-1);
  };

  // Get current location and recenter map

  if (!routeData || !viewState) {
    return null;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
        bgcolor: "black",
        overflow: "hidden",
      }}
    >
      {/* TOP INFO BAR - Route info placeholder */}
      <Paper
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: "rgba(0, 128, 0, 0.9)",
          color: "white",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          📍 Route Info Placeholder
        </Typography>
        <Typography variant="body2">Next instruction will be here</Typography>
      </Paper>

      {/* MAP */}
      <Box
        sx={{
          height: "100%",
          pt: "100px", // Space for top banner
          pb: "120px", // Space for bottom banner
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.300",
        }}
      >
        <Typography variant="h4" color="text.secondary">
          🗺️ MAP PLACEHOLDER
        </Typography>
      </Box>

      {/* BOTTOM BANNER */}
      <Paper
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: "black",
          color: "white",
          borderRadius: 0,
          p: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* LEFT - Close button */}
          <IconButton
            onClick={handleExit}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* CENTER - Time and distance */}
          <Stack alignItems="center">
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#4CAF50", // Green like the image
              }}
            >
              {routeData.estimated_time || "0"} min
            </Typography>
            <Typography variant="body2" color="grey.300">
              {routeData.distance || "0"} km • ETA: --:--
            </Typography>
          </Stack>

          {/* RIGHT - Settings/Options icon placeholder */}
          <IconButton
            onClick={handleExit}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};
