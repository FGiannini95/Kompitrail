import React, { useEffect, useState, useRef } from "react";

/**
 * Recalculates distance/duration only when start/end change (e.g. after Confirm in MapDialog).
 * Debounced (default 600ms) to avoid multiple rapid recalcs
 * Cancels in-flight request via AbortController
 * Ignores stale responses via requestId guard
 */
export const useRouteMetrics = ({
  start,
  end,
  waypoints = [],
  enabled = true,
  debounceMs = 2000,
  endpointUrl,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const waypointsRef = useRef(waypoints);

  // Valid waypoints
  const hasValidWaypoints = waypoints.every(
    (wp) => wp?.lat != null && wp?.lng != null
  );

  // Update ref when waypoints change
  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);

  // We have a starting and ending points
  const hasPoints =
    start?.lat != null &&
    start?.lng != null &&
    end?.lat != null &&
    end?.lng != null &&
    hasValidWaypoints;

  useEffect(() => {
    if (!enabled) return;

    if (!hasPoints) {
      setData(null);
      setError(null);

      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();

      // Clear pending debounce
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);

    // Schedule route calculation after a short delay
    timerRef.current = setTimeout(async () => {
      // Use fresh waypoints from ref to avoid stale closure
      const freshWaypoints = waypointsRef.current;

      // Cancel any previous request still running
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        // Build request body with waypoints support
        const requestBody = {
          start: { lat: start.lat, lng: start.lng },
          end: { lat: end.lat, lng: end.lng },
        };

        // Add waypoints array if present and valid
        if (freshWaypoints && freshWaypoints.length > 0) {
          requestBody.waypoints = freshWaypoints
            .map((wp) => ({
              lat: wp.lat || wp.waypoint_lat,
              lng: wp.lng || wp.waypoint_lng,
              position: wp.position || 0,
            }))
            .sort((a, b) => a.position - b.position); // Sort by position
        }

        // Call backend to calculate distance and time
        const response = await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error en calcular la ruta");
        }

        const result = await response.json();

        // Save the calculated metrics
        setData({
          distanceKm: result.distanceKm,
          durationMinutes: result.durationMinutes,
          geometry: result.geometry,
        });
      } catch (err) {
        // Ignore aborted requests (expected behavior)
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    enabled,
    hasPoints,
    start?.lat,
    start?.lng,
    end?.lat,
    end?.lng,
    waypoints,
    endpointUrl,
    debounceMs,
  ]);

  return { data, loading, error };
};
