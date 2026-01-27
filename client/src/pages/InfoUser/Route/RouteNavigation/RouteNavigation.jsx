import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map, { Source, Layer, Marker } from "react-map-gl/mapbox";

import { Box } from "@mui/material";

import { calculateDistance } from "../../../../helpers/calculateDistance";
import { useGPSTracking } from "../../../../hooks/useGPSTracking";
import { useNavigationInstructions } from "../../../../hooks/useNavigationInstructions";
// Components
import { MarkerWithIcon } from "../../../../components/Maps/MarkerWithIcon/MarkerWithIcon";
import { Loading } from "../../../../components/Loading/Loading";
import { ROUTES_URL } from "../../../../api";
import { TopBannerNavigation } from "../../../../components/Maps/TopBannerNavigation.jsx/TopBannerNavigation";
import { BottomBannerNavigation } from "../../../../components/Maps/BottomBannerNavigation/BottomBannerNavigation";

export const RouteNavigation = () => {
  const [viewState, setViewState] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { routeData } = location.state || {};
  const { currentPosition, startTracking, stopTracking } = useGPSTracking();
  const { currentInstruction } = useNavigationInstructions(
    routeData,
    currentPosition,
  );

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
      routeData.starting_lng,
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

  // Add this useEffect temporarily in RouteNavigation for testing
  useEffect(() => {
    const testNavigation = async () => {
      try {
        const response = await fetch(`${ROUTES_URL}/navigation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: [
              { lng: -3.5986, lat: 37.1773 },
              { lng: -3.6, lat: 37.18 },
            ],
          }),
        });

        const data = await response.json();
      } catch (error) {
        console.error(" Navigation error:", error);
      }
    };

    testNavigation();
  }, []);

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
      <TopBannerNavigation currentInstruction={currentInstruction} />

      {/* BOTTOM BANNER */}
      <BottomBannerNavigation
        routeData={routeData}
        currentPosition={currentPosition}
        isNearStartingPoint={isNearStartingPoint}
        onExit={() => navigate(-1)}
        onRecenter={(newViewState) =>
          setViewState((prev) => ({ ...prev, ...newViewState }))
        }
      />
    </Box>
  );
};
