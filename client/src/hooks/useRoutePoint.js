/**
 * Master hook for managing a geographic point with i18n labels.
 
 * Features:
 * - Reverse geocodes a point for multiple languages
 * - Returns the label in the current UI language
 * - Caches i18n data to avoid duplicate API calls
 * - Handles loading and error states
 * - const point = {
      lat: 37.1773,
      lng: -3.5986,
      i18n: {
        es: { full: "...", short: "..." },
        it: { full: "...", short: "..." },
        en: { full: "...", short: "..." }
      }
}*/

import React, { useCallback, useState } from "react";
import { useReverseGeocoding } from "./useReverseGeocoding";
import { fetchPointI18n, getPointLabel } from "../helpers/pointMetrics";

export const useRoutePoint = ({ initialPoint = null }) => {
  const { reverseGeocode, currentLang } = useReverseGeocoding();
  const [point, setPoint] = useState(initialPoint);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLabel = useCallback(
    (type = "full") => {
      return getPointLabel(point, currentLang, type);
    },
    [point, currentLang]
  );

  // Update point coordinates and fetch i18n labels for all languages
  const updatePoint = useCallback(
    async (lat, lng) => {
      // Immediate feedback: set coordinates right away
      setPoint({ lat, lng, i18n: null });
      setLoading(true);
      setError(null);

      try {
        // Fetch labels for all languages in parallel
        const i18n = await fetchPointI18n(lat, lng, reverseGeocode);

        // Update point with i18n data
        setPoint({ lat, lng, i18n });
      } catch (err) {
        console.error("Error fetching i18n labels:", err);

        // Fallback: keep coordinates but set fallback labels
        const fallback = {
          es: { full: "Zona no definida", short: "Zona no definida" },
          it: { full: "Zona non definita", short: "Zona non definita" },
          en: { full: "Undefined area", short: "Undefined area" },
        };

        setPoint({ lat, lng, i18n: fallback });
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [reverseGeocode]
  );

  return {
    point,
    setPoint,
    updatePoint,
    loading,
    error,
    getLabel,
  };
};
