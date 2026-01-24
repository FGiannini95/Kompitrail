import React from "react";

import { IconButton } from "@mui/material";
import { MyLocationOutlined as MyLocationOutlinedIcon } from "@mui/icons-material";

import { getCurrentGPSPosition } from "../../../helpers/getCurrentGPSPosition";

export const RecenterButton = ({
  onRecenter,
  onUpdatePoint,
  fallbackToGranada = false,
  zoom = 17,
  absolute = true,
  sx = {},
  size = "small",
  ...props
}) => {
  const isMapMode = Boolean(onUpdatePoint);

  const handleRecenter = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    // Always get fresh GPS position
    getCurrentGPSPosition({
      onSuccess: async (position) => {
        onRecenter({
          latitude: position.latitude,
          longitude: position.longitude,
          zoom: absolute ? zoom : 17,
          bearing: position.heading || 0,
        });

        if (onUpdatePoint) {
          await onUpdatePoint(position.latitude, position.longitude);
        }
      },
      onError: (error) => {
        console.error("Recenter failed:", error);
      },
      fallbackToGranada,
      timeout: 5000,
    });
  };

  return (
    <IconButton
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleRecenter}
      sx={{
        ...(isMapMode
          ? {
              // RouteMapDialog
              position: "absolute",
              left: 12,
              bottom: 12,
              pointerEvents: "auto",
              bgcolor: "white",
              color: "black",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }
          : {
              // RouteNavigation
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }),
        ...sx,
      }}
      {...props}
    >
      <MyLocationOutlinedIcon fontSize={size} />
    </IconButton>
  );
};
