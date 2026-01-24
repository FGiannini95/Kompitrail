// Hook for live GPS position tracking
import React, { useRef, useState, useEffect, useCallback } from "react";

export const useGPSTracking = ({
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 5000,
  autoStart = false,
} = {}) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  const startTracking = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser");
      return;
    }

    // Don't start if already tracking
    if (isTracking) return;

    setIsTracking(true);
    setError(null);

    // Configure GPS options
    const gpsOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const handlePositionSuccess = (position) => {
      const { coords, timestamp } = position;

      setCurrentPosition({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy, // Accuracy in meters
        heading: coords.heading || null, // Direction of movement (degrees)
        speed: coords.speed || null, // Speed in m/s
        timestamp, // When position was recorded
      });

      setError(null);
    };

    const handlePositionError = (gpsError) => {
      let errorMessage = "GPS tracking failed";

      switch (gpsError.code) {
        case gpsError.PERMISSION_DENIED:
          errorMessage = "GPS permission denied by user";
          break;
        case gpsError.POSITION_UNAVAILABLE:
          errorMessage = "GPS position unavailable";
          break;
        case gpsError.TIMEOUT:
          errorMessage = "GPS timeout - try moving to open area";
          break;
        default:
          errorMessage = `GPS error: ${gpsError.message}`;
      }

      setError(errorMessage);
      console.error("GPS tracking error:", gpsError);
    };

    // Start continuous GPS tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionSuccess,
      handlePositionError,
      gpsOptions
    );
  }, []);

  // Cleans up watchPosition and resets state
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);
    setError(null);
  }, []);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [autoStart]);

  return {
    currentPosition,
    isTracking,
    error,
    startTracking,
    stopTracking,
  };
};
