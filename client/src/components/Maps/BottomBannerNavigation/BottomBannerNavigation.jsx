import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Paper, Typography, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { RecenterButton } from "../RecenterButton/RecenterButton";
import { calculateDistance } from "../../../helpers/calculateDistance";

export const BottomBannerNavigation = ({
  routeData,
  currentPosition,
  isNearStartingPoint,
  onExit,
  onRecenter,
}) => {
  const [remainingDistance, setRemainingDistance] = useState(0);
  const { t } = useTranslation(["oneRoute"]);

  // Calculate remaining distance based on current position
  const calculateRemainingRouteDistance = (currentPos, routeGeometry) => {
    if (!routeGeometry?.coordinates) return 0;

    const coordinates = routeGeometry.coordinates;

    // Find the closest point on the route
    let closestIndex = 0;
    let minDistance = Infinity;

    coordinates.forEach((coord, index) => {
      const [lng, lat] = coord;
      const distance = calculateDistance(
        currentPos.latitude,
        currentPos.longitude,
        lat,
        lng,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    // Calculate remaining distance from closestIndex to the end
    let remainingDistance = 0;
    for (let i = closestIndex; i < coordinates.length - 1; i++) {
      const [lng1, lat1] = coordinates[i];
      const [lng2, lat2] = coordinates[i + 1];
      remainingDistance += calculateDistance(lat1, lng1, lat2, lng2);
    }

    return remainingDistance;
  };

  useEffect(() => {
    if (!currentPosition || !routeData) return;

    const distanceKm = calculateRemainingRouteDistance(
      currentPosition,
      routeData.route_geometry,
    );

    setRemainingDistance(distanceKm);
  }, [currentPosition, routeData]);

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  const handleRecenter = (newViewState) => {
    if (onRecenter) {
      onRecenter(newViewState);
    }
  };

  return (
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
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

        {/* CENTER - Go to starting point or distance to destination */}
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
              <Typography variant="body2">
                {t("oneRoute:navigation.estimatedArrival")}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#4CAF50",
                }}
              >
                {remainingDistance.toFixed(1)} km
              </Typography>
            </>
          )}
        </Stack>

        {/* RIGHT  - Recenter button */}
        <RecenterButton
          absolute={false}
          currentPosition={currentPosition}
          onRecenter={handleRecenter}
        />
      </Stack>
    </Paper>
  );
};
