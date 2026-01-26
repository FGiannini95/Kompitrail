import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";
import { useTranslation, Trans } from "react-i18next";

import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { calculateDistance } from "../../../../helpers/calculateDistance";
import { useGPSTracking } from "../../../../hooks/useGPSTracking";
// Components
import { RecenterButton } from "../../../../components/Maps/RecenterButton/RecenterButton";
import { MarkerWithIcon } from "../../../../components/Maps/MarkerWithIcon/MarkerWithIcon";
import { Loading } from "../../../../components/Loading/Loading";

export const RouteNavigation = () => {
  const [viewState, setViewState] = useState(null);
  const [currentETA, setCurrentETA] = useState("--:--");

  const location = useLocation();
  const navigate = useNavigate();

  const { routeData } = location.state || {};
  const { currentPosition, isTracking, error, startTracking, stopTracking } =
    useGPSTracking();
  const { t } = useTranslation(["buttons"]);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Start GPS tracking for navigation
  useEffect(() => {
    if (!routeData) {
      navigate(-1);
      return;
    }

    startTracking();

    return () => {
      stopTracking();
    };
  }, [routeData, navigate, startTracking, stopTracking]);

  const isNearStartingPoint = useMemo(() => {
    if (!currentPosition || !routeData) {
      return false;
    }

    const distance = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      routeData.starting_lat,
      routeData.starting_lng
    );

    return distance <= 0.5;
  }, [currentPosition, routeData]);

  // Initial centering
  useEffect(() => {
    if (!currentPosition || !routeData) return;

    if (isNearStartingPoint) {
      setViewState({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        zoom: 17,
        bearing: currentPosition.heading || 0,
        pitch: 30,
      });
    } else {
      setViewState({
        latitude: routeData.starting_lat,
        longitude: routeData.starting_lng,
        zoom: 13,
        bearing: 0,
        pitch: 30,
      });
    }
  }, [currentPosition, routeData, isNearStartingPoint]);

  const handleExit = () => {
    navigate(-1);
  };

  // Calculate ETA based on current time + estimated_time
  const calculateETA = () => {
    if (!routeData?.estimated_time) return "--:--";

    const now = new Date();
    const etaTime = new Date(
      now.getTime() + routeData.estimated_time * 60 * 1000
    ); // Calcualted in milliseconds

    return etaTime.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Update ETA every minute
  useEffect(() => {
    setCurrentETA(calculateETA());
    const interval = setInterval(() => {
      setCurrentETA(calculateETA());
    }, 60000);

    return () => clearInterval(interval);
  }, [routeData?.estimated_time]);

  if (!routeData) {
    return null;
  }

  if (!currentPosition || !viewState) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "black",
        }}
      >
        <Loading />
      </Box>
    );
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
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
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
        {/* Current position marker */}
        {currentPosition && (
          <Marker
            longitude={currentPosition.longitude}
            latitude={currentPosition.latitude}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                position: "relative",
                transform: currentPosition.heading
                  ? `rotate(${currentPosition.heading}deg)`
                  : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "20px solid #2196F3",
                }}
              />
            </Box>
          </Marker>
        )}

        {/* Start point */}
        <MarkerWithIcon
          longitude={routeData.starting_lng}
          latitude={routeData.starting_lat}
          type="start"
        />

        {/* End point */}
        <MarkerWithIcon
          longitude={routeData.ending_lng}
          latitude={routeData.ending_lat}
          type="end"
        />

        {/* Waypoints */}
        {routeData.waypoints?.map((waypoint, index) => (
          <MarkerWithIcon
            key={`nav-waypoint-${index}`}
            longitude={waypoint.lng}
            latitude={waypoint.lat}
            type="waypoint"
            number={index + 1}
          />
        ))}
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
        <Typography variant="body2">
          Segui il percorso motociclistico
        </Typography>
      </Paper>

      {/* BOTTOM BANNER */}
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

          {/* CENTER - Go to starting point or Time and distance*/}
          <Stack alignItems="center">
            {!isNearStartingPoint ? (
              <Typography textAlign="center">
                <Trans
                  i18nKey="openMaps"
                  ns="buttons"
                  components={{
                    1: (
                      <Link
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${routeData.starting_lat},${routeData.starting_lng}`;
                          window.open(url, "_blank");
                        }}
                        style={{
                          color: "white",
                          textDecoration: "underline",
                        }}
                        underline="hover"
                      />
                    ),
                  }}
                />
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#4CAF50",
                  }}
                >
                  {routeData?.estimated_time || "0"} min
                </Typography>
                <Typography variant="body2" color="grey.300">
                  {routeData?.distance || "0"} km • {currentETA}
                </Typography>
              </>
            )}
          </Stack>

          {/* RIGHT  - Recenter button */}
          <RecenterButton
            currentPosition={currentPosition}
            onRecenter={(newViewState) =>
              setViewState((prev) => ({ ...prev, ...newViewState }))
            }
          />
        </Stack>
      </Paper>
    </Box>
  );
};
