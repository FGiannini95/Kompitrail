import React, { useCallback, useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";

// Hooks & Providers
import { useReverseGeocoding } from "../../../hooks/useReverseGeocoding";
import { useLocalizedPointLabel } from "../../../hooks/useLocalizedPointLabel";
// Components
import { Loading } from "../../Loading/Loading";

export const RouteMapDialog = ({
  open,
  initialSelected = null,
  onCancel,
  onConfirm,
  maxWidth = "md",
}) => {
  const { t } = useTranslation(["buttons"]);
  const {
    reverseGeocode,
    loading: isResolvingLabel,
    currentLang,
  } = useReverseGeocoding();
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Search input value (UI only for now)
  const [query, setQuery] = useState("");
  // Map camera state (controlled map)
  const [viewState, setViewState] = useState(null);
  // Draft selection (saved only on Confirm)
  const [selected, setSelected] = useState(() => {
    if (initialSelected?.lat != null && initialSelected?.lng != null) {
      return {
        label: initialSelected.label || "",
        lat: Number(initialSelected.lat),
        lng: Number(initialSelected.lng),
      };
    }
    return null;
  });

  // It doesn't return anything, it doesn't create a new state, it reads a state and update it
  useLocalizedPointLabel({
    point: selected,
    setPoint: setSelected,
    enabled: open,
  });

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

          // Move the pin too
          if (!setPin) return;

          // Resolve label
          const label = await reverseGeocode({
            lat,
            lng,
            language: currentLang,
          });

          setSelected({
            label,
            lat,
            lng,
            lang: currentLang,
          });
        },
        (error) => {
          console.error("Geolocation error", error);

          // Only fallback to Granada when explicitly requested (and only for open)
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
    [reverseGeocode, currentLang]
  );

  useEffect(() => {
    if (!open) return;
    // Reset camera state each time the dialog opens
    setViewState(null);

    // Reset search input each time the dialog opens
    setQuery("");

    // If we have a selected point, center on it immediately
    if (initialSelected?.lat != null && initialSelected?.lng != null) {
      const lat = Number(initialSelected.lat);
      const lng = Number(initialSelected.lng);

      setSelected({
        label: initialSelected.label || "",
        lat,
        lng,
        lang: initialSelected.lang,
      });

      // Center on the selected point
      setViewState({
        latitude: lat,
        longitude: lng,
        zoom: 13,
      });

      return;
    }

    getCurrentLocation({ fallbackToGranada: true });
  }, [open, initialSelected?.lat, initialSelected?.lng, getCurrentLocation]);

  const recenterToCurrentLocation = () => {
    getCurrentLocation({ fallbackToGranada: false, setPin: true });
  };

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

          {selected && (
            <Box sx={{ pb: 1 }}>
              <Typography
                variant="body2"
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                })}
                title={selected.label}
              >
                {selected.label}
              </Typography>
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            {!viewState ? (
              <Loading />
            ) : (
              <Map
                mapboxAccessToken={mapboxToken}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                onClick={async (evt) => {
                  const { lng, lat } = evt.lngLat;

                  // Immediate feedback: show pin right away with a temporary label
                  setSelected({
                    label: "Resolving place name…",
                    lat,
                    lng,
                  });

                  // Resolve a readable name from Mapbox
                  const label = await reverseGeocode({
                    lat,
                    lng,
                    language: currentLang,
                  });

                  // Update the selection
                  setSelected({
                    label,
                    lat,
                    lng,
                    lang: currentLang,
                  });
                }}
              >
                {selected && (
                  <Marker
                    longitude={selected.lng}
                    latitude={selected.lat}
                    anchor="bottom"
                  />
                )}
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
          disabled={!selected || isResolvingLabel}
          onClick={() => {
            onConfirm?.(selected);
          }}
          color="success"
        >
          {t("buttons:confirmar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
