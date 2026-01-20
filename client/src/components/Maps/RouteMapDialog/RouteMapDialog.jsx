import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Map, { Source, Layer } from "react-map-gl/mapbox";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";

import { useRoutePoint } from "../../../hooks/useRoutePoint";
import { Loading } from "../../Loading/Loading";
import { MarkerWithIcon } from "../MarkerWithIcon/MarkerWithIcon";
import { ROUTES_URL } from "../../../api";
import { useRouteMetrics } from "../../../hooks/useRouteMetrics";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";

export const RouteMapDialog = forwardRef(
  (
    {
      open,
      initialSelected = null,
      onCancel,
      onConfirm,
      maxWidth = "md",
      waypointData = null,
      mapTarget = null,
    },
    ref
  ) => {
    const [query, setQuery] = useState(""); // Search input value
    const [viewState, setViewState] = useState(null); // Map camera state
    const [updatedRoute, setUpdatedRoute] = useState(null);

    const { t } = useTranslation(["buttons"]);
    const {
      point,
      updatePoint,
      loading: isResolvingLabel,
      getLabel,
      resetPoint,
    } = useRoutePoint({
      initialPoint: initialSelected,
      enabled: open,
    });

    useImperativeHandle(
      ref,
      () => ({
        resetPoint,
      }),
      [resetPoint]
    );

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const isWaypointMode = Boolean(
      waypointData?.startPoint && waypointData?.endPoint
    );

    // Get current location from browser
    const getCurrentLocation = useCallback(
      ({ fallbackToGranada = false, setPin = false } = {}) => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Recenter the camera
            setViewState({
              latitude: lat,
              longitude: lng,
              zoom: 13,
            });

            // Move the pin and fetch i18n labels
            if (setPin) {
              await updatePoint(lat, lng);
            }
          },
          (error) => {
            console.error("Geolocation error", error);

            // Fallback to Granada if timeout and explicitly requested
            if (fallbackToGranada && error.code === 3) {
              setViewState({
                latitude: 37.1773,
                longitude: -3.5986,
                zoom: 13,
              });
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60000,
          }
        );
      },
      [updatePoint]
    );

    useEffect(() => {
      if (!open) return;

      setViewState(null);
      setQuery("");

      // In waypoint mode, center on start point and clear point state
      if (isWaypointMode && waypointData?.startPoint) {
        // Force waypoint to be null
        updatePoint(null, null);

        setViewState({
          latitude: waypointData.startPoint.lat,
          longitude: waypointData.startPoint.lng,
          zoom: 13,
        });
        return;
      }

      // If we have an initial point, center on it
      if (initialSelected?.lat) {
        setViewState({
          latitude: initialSelected.lat,
          longitude: initialSelected.lng,
          zoom: 13,
        });
        return;
      }

      // Fallback to current location
      getCurrentLocation({ fallbackToGranada: true });
    }, [open]);

    // Recenter to current location and update pin
    const recenterToCurrentLocation = () => {
      getCurrentLocation({ fallbackToGranada: false, setPin: true });
    };

    // Handle map click: update point coordinates + fetch i18n labels
    const handleMapClick = async (evt) => {
      const { lng, lat } = evt.lngLat;
      await updatePoint(lat, lng);
    };

    const waypointRouteMetrics = useRouteMetrics({
      start: isWaypointMode ? waypointData?.startPoint : null,
      end: isWaypointMode ? waypointData?.endPoint : null,
      waypoint: isWaypointMode ? point : null,
      endpointUrl: `${ROUTES_URL}/metrics`,
      enabled: isWaypointMode && Boolean(point),
    });

    const showMap = viewState && (point || isWaypointMode);

    if (!mapboxToken) {
      return (
        <Dialog open={open} onClose={onCancel} fullWidth maxWidth={maxWidth}>
          <DialogContent>Missing VITE_MAPBOX_TOKEN</DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: (theme) => ({
            bgcolor: theme.palette.kompitrail.card,
            color: theme.palette.text.primary,
            borderRadius: 2,
          }),
        }}
      >
        <DialogContent sx={{ overflow: "visible" }}>
          <Box
            sx={{
              height: "79vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search input (placeholder for future feature) */}
            <Box sx={{ pb: 2 }}>
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                InputProps={{
                  endAdornment: <SearchOutlinedIcon />,
                }}
              />
            </Box>

            {/* Display current point label in current UI language */}
            {point && (
              <Box sx={{ pb: 1 }}>
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  })}
                  title={getLabel("full")}
                >
                  {getLabel("full")}
                </Typography>
              </Box>
            )}

            {/* Map */}
            <Box sx={{ flex: 1 }}>
              {!showMap ? (
                <Loading />
              ) : (
                <Map
                  mapboxAccessToken={mapboxToken}
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  mapStyle="mapbox://styles/mapbox/outdoors-v12"
                  onClick={handleMapClick}
                >
                  {/* Route line in waypoint mode */}
                  {isWaypointMode &&
                    (waypointRouteMetrics.data?.geometry ||
                      waypointData?.routeGeometry) && (
                      <Source
                        key={`route-${Date.now()}`} // ← Sempre diverso
                        id="current-route"
                        type="geojson"
                        data={{
                          type: "Feature",
                          geometry:
                            waypointRouteMetrics.data?.geometry ||
                            waypointData?.routeGeometry,
                        }}
                      >
                        <Layer
                          id="current-route-line"
                          type="line"
                          paint={{
                            "line-color": "#FF6B35",
                            "line-width": 5,
                            "line-opacity": 0.9,
                          }}
                        />
                      </Source>
                    )}

                  {/* Normal mode markers */}
                  {!isWaypointMode && point && (
                    <MarkerWithIcon
                      longitude={point.lng}
                      latitude={point.lat}
                      type={mapTarget}
                    />
                  )}

                  {/* Waypoint mode markers */}
                  {isWaypointMode && (
                    <>
                      <MarkerWithIcon
                        longitude={waypointData.startPoint.lng}
                        latitude={waypointData.startPoint.lat}
                        type="start"
                      />
                      <MarkerWithIcon
                        longitude={waypointData.endPoint.lng}
                        latitude={waypointData.endPoint.lat}
                        type="end"
                      />
                      {point && (
                        <MarkerWithIcon
                          longitude={point.lng}
                          latitude={point.lat}
                          type="waypoint"
                        />
                      )}
                    </>
                  )}

                  {/* Recenter button */}
                  <IconButton
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      recenterToCurrentLocation();
                    }}
                    sx={(theme) => ({
                      position: "absolute",
                      left: 12,
                      bottom: 12,
                      pointerEvents: "auto",
                      bgcolor: theme.palette.kompitrail.card,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 2,
                    })}
                  >
                    <MyLocationOutlinedIcon fontSize="small" />
                  </IconButton>
                </Map>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel} color="error">
            {t("buttons:cancel")}
          </Button>
          <Button
            disabled={!point || isResolvingLabel}
            onClick={() => {
              onConfirm?.(point);
            }}
            color="success"
          >
            {t("buttons:confirmar")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

RouteMapDialog.displayName = "RouteMapDialog";
