import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { Paper, Typography, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { RecenterButton } from "../RecenterButton/RecenterButton";

export const BottomBannerNavigation = ({
  routeData,
  currentPosition,
  isNearStartingPoint,
  onExit,
  onRecenter,
}) => {
  const [currentETA, setCurrentETA] = useState("--:--");

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

  // Calculate ETA based on current time + estimated_time
  const calculateETA = () => {
    if (!routeData?.estimated_time) return "--:--";

    const now = new Date();
    const etaTime = new Date(
      now.getTime() + routeData.estimated_time * 60 * 1000,
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
          absolute={false}
          currentPosition={currentPosition}
          onRecenter={handleRecenter}
        />
      </Stack>
    </Paper>
  );
};
