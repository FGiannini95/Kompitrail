import React, { useEffect, useRef } from "react";
import { useReverseGeocoding } from "./useReverseGeocoding";
/**
 * Keeps a point label in sync with the current UI language.
 * - Works with points shaped like: { label, lat, lng, lang }
 * - If point.lang !== currentLang, re-runs reverse geocoding
 * - Updates only label + lang, never touches coordinates
 */
export const useLocalizedPointLabel = ({ point, setPoint, enabled = true }) => {
  const { reverseGeocode, currentLang } = useReverseGeocoding();

  // Avoid multiple parallel updates
  const isUpdatingRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (!point) return;

    const { lat, lng, lang } = point;

    // We need valid coordinates
    if (lat == null || lng == null) return;

    // If label matches currentLang do nothing
    if (lang == currentLang) return;

    // Prevent overlapping updates
    if (isUpdatingRef.current) return;

    let cancelled = false;
    // Only one reverse geocode at a time, no duplicate requests, no infinite loop
    isUpdatingRef.current = true;

    const run = async () => {
      try {
        const { fullLabel, shortLabel } = await reverseGeocode({
          lat,
          lng,
          language: currentLang,
        });

        if (cancelled) return;

        // Update only label + lang
        setPoint((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            label: fullLabel,
            shortLabel,
            lang: currentLang,
          };
        });
      } finally {
        isUpdatingRef.current = false;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    point?.lat,
    point?.lng,
    point?.lang,
    currentLang,
    reverseGeocode,
    setPoint,
  ]);

  return {};
};
