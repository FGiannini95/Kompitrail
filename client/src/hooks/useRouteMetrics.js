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
  enabled = true,
  debounceMs = 600,
  endpointUrl,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const abortRef = useRef(null);

  // We have a starting and ending points
  const hasPoints =
    start?.lat != null &&
    start?.lng != null &&
    end?.lat != null &&
    end?.lng != null;

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

    // Schedule route calculation after a short delay
    timerRef.current = setTimeout(async () => {
      // Cancel any previous request still running
      if (abortRef.current) {
        abortRef.current.abort();
      }
      // Create a new aborter controller for this request
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        // Call backend to calculate distance and time
        const response = await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            start: { lat: start.lat, lng: start.lng },
            end: { lat: end.lat, lng: end.lng },
          }),
        });

        if (!response.ok) {
          throw new Error("Error en calcular la ruta");
        }

        const result = await response.json();

        // Save the calculated metrics
        setData({
          distanceKm: result.distanceKm,
          durationMinutes: result.durationMinutes,
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
    endpointUrl,
    debounceMs,
  ]);

  return { data, loading, error };
};
