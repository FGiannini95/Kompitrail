import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import Map, { Source, Layer } from "react-map-gl/mapbox";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
// Utils
import { ROUTES_URL } from "../../../api";
// Hooks & Providers
import { useRoutePoint } from "../../../hooks/useRoutePoint";
import { useRouteMetrics } from "../../../hooks/useRouteMetrics";
// Components
import { MarkerWithIcon } from "../MarkerWithIcon/MarkerWithIcon";
import { Loading } from "../../Loading/Loading";
import { SearchLocationInput } from "../SearchLocationInput/SearchLocationInput ";
import { RecenterButton } from "../RecenterButton/RecenterButton";
import { getCurrentGPSPosition } from "../../../helpers/getCurrentGPSPosition";

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
    const [viewState, setViewState] = useState(null); // Map camera state

    const { t } = useTranslation(["buttons"]);
    const {
      point,
      setPoint,
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

    useEffect(() => {
      if (!open) return;

      setViewState(null);

      // In waypoint mode, center on start point and clear point state
      if (isWaypointMode && waypointData?.startPoint) {
        setPoint(null);
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

      // Fallback to current location using helper
      getCurrentGPSPosition({
        onSuccess: (position) => {
          setViewState({
            latitude: position.latitude,
            longitude: position.longitude,
            zoom: 13,
          });
        },
        fallbackToGranada: true,
      });
    }, [open]);

    // Handle map click: update point coordinates + fetch i18n labels
    const handleMapClick = async (evt) => {
      const { lng, lat } = evt.lngLat;
      await updatePoint(lat, lng);
    };

    const waypointRouteMetrics = useRouteMetrics({
      start: isWaypointMode ? waypointData?.startPoint : null,
      end: isWaypointMode ? waypointData?.endPoint : null,
      waypoints:
        isWaypointMode && point
          ? [...(waypointData?.existingWaypoints || []), point] // Include existing + current
          : waypointData?.existingWaypoints || [], // Show existing
      endpointUrl: `${ROUTES_URL}/metrics`,
      enabled: isWaypointMode,
    });

    const showMap = viewState && (point || isWaypointMode);

    if (!mapboxToken) {
      return (
        <Dialog open={open} onClose={onCancel} fullWidth maxWidth={maxWidth}>
          <DialogContent>Missing VITE_MAPBOX_TOKEN</DialogContent>
        </Dialog>
      );
    }

    const handleLocationSearch = async (location) => {
      // Move map to selected location
      setViewState({
        latitude: location.lat,
        longitude: location.lng,
        zoom: 13,
      });

      // Set the point with correct marker type
      await updatePoint(location.lat, location.lng);
    };

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
            {/* Search input */}
            <SearchLocationInput
              onLocationSelect={handleLocationSearch}
              placeholder={t("buttons:search")}
              mapTarget={mapTarget}
            />

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
                        key={`route-${Date.now()}`}
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
                            "line-width": 5,
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

                      {/* Show all existing waypoints */}
                      {waypointData?.existingWaypoints?.map(
                        (waypoint, index) => (
                          <MarkerWithIcon
                            key={`existing-waypoint-${index}`}
                            longitude={waypoint.lng || waypoint.waypoint_lng}
                            latitude={waypoint.lat || waypoint.waypoint_lat}
                            type="waypoint"
                            number={waypoint.displayNumber || index + 1}
                          />
                        )
                      )}

                      {/* Show current waypoint if present */}
                      {point && (
                        <MarkerWithIcon
                          longitude={point.lng}
                          latitude={point.lat}
                          type="waypoint"
                          number={
                            (waypointData?.existingWaypoints?.length || 0) + 1
                          }
                        />
                      )}
                    </>
                  )}
                  {/* Recenter button */}
                  <RecenterButton
                    onRecenter={setViewState}
                    onUpdatePoint={updatePoint}
                  />
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
