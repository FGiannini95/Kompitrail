import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map, { Source, Layer } from "react-map-gl/mapbox";

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
        overflow: "hidden",
      }}
    >
      {/* MAP */}
      <Map
        mapboxAccessToken={mapboxToken}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        {/* Route line */}
        {routeData.route_geometry && (
          <Source
            id="navigation-route"
            type="geojson"
            data={{
              type: "Feature",
              geometry: routeData.route_geometry,
            }}
          >
            <Layer
              id="navigation-route-line"
              type="line"
              paint={{
                "line-width": 6,
                "line-color": "#1976d2",
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}
      </Map>

      {/* TOP BANNER */}
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

      {/* BOTTOM BANNER - Floating over map */}
      <Paper
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: 2,
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
                color: "#4CAF50",
              }}
            >
              {routeData.estimated_time || "0"} min
            </Typography>
            <Typography variant="body2" color="grey.300">
              {routeData.distance || "0"} km • ETA: --:--
            </Typography>
          </Stack>

          {/* RIGHT  */}
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
