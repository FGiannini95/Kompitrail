import React, { useRef, useEffect } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";

import { Box, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

// Read-only map preview showing the route geometry with start/end markers
export const RouteMapPreview = ({ routeGeometry, startPoint, endPoint }) => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const mapRef = useRef();

  // Auto-fit bounds when geometry loads
  useEffect(() => {
    if (!mapRef.current || !routeGeometry?.coordinates) return;

    const coords = routeGeometry.coordinates;

    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    const bounds = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ];

    mapRef.current.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  }, [routeGeometry]);

  if (!mapboxToken) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>Missing VITE_MAPBOX_TOKEN</Box>
    );
  }

  if (!routeGeometry) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 300,
          bgcolor: "grey.200",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Mappa preview - Coming soon
        </Typography>
      </Box>
    );
  }

  // Convert route_geometry to GeoJSON Feature
  const routeGeoJSON = routeGeometry
    ? { type: "Feature", geometry: routeGeometry }
    : null;

  return (
    <Box
      sx={{ width: "100%", height: 400, borderRadius: 1, overflow: "hidden" }}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          latitude: startPoint.lat,
          longitude: startPoint.lng,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Route line */}
        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#FF6B35",
                "line-width": 5,
                "line-opacity": 0.9,
              }}
            />
          </Source>
        )}

        {/* Starting point marker */}
        {startPoint?.lat && startPoint?.lng && (
          <Marker
            longitude={startPoint.lng}
            latitude={startPoint.lat}
            anchor="bottom"
          >
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 30,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                color: "#000000",
              }}
            />
          </Marker>
        )}

        {/* Ending point marker */}
        {endPoint?.lat && endPoint?.lng && (
          <Marker
            longitude={endPoint.lng}
            latitude={endPoint.lat}
            anchor="bottom"
          >
            <FlagOutlinedIcon
              sx={{
                fontSize: 30,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                color: "#000000",
              }}
            />
          </Marker>
        )}
      </Map>
    </Box>
  );
};
