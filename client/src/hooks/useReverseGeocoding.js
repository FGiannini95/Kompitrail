import React, { useCallback, useState } from "react";
import { getCurrentLang } from "../helpers/oneRouteUtils";
import { useTranslation } from "react-i18next";

// Encapsulates Mapbox reverse geocoding logic: takes lat/lng and returns a human-readable label
export const useReverseGeocoding = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const { i18n } = useTranslation("");

  const [loading, setLoading] = useState(false);
  const currentLang = getCurrentLang(i18n);

  // Picks the best short label from Mapbox using place_type priority.
  // Priority: place > locality > neighborhood > address > fallback.
  const pickShortLabel = (features) => {
    if (!Array.isArray(features) || features.length === 0) return null;

    const findByType = (type) =>
      features.find(
        (f) => Array.isArray(f?.place_type) && f.place_type.includes(type)
      );

    const place =
      findByType("place") ||
      findByType("locality") ||
      findByType("neighborhood") ||
      findByType("address");

    const text = place?.text;
    if (typeof text === "string" && text.trim() !== "") return text.trim();

    return null;
  };

  // Converts full address to "street, city" format, removes postal codes and country info for better UI display
  const createCleanLabel = (rawLabel) => {
    if (!rawLabel || typeof rawLabel !== "string") return "Zona no definida";

    // Split by comma and take first 2 parts (street + city)
    // Example: "Chain Street, Manchester, M1 4DZ, United Kingdom" → "Chain Street, Manchester"
    const parts = rawLabel.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]}`;
    }
    return parts[0] || "Zona no definida";
  };

  const reverseGeocode = useCallback(
    async ({ lat, lng, language = currentLang }) => {
      if (!mapboxToken)
        return {
          fullLabel: "Zona no definida",
          shortLabel: "Zona no definida",
        };

      try {
        setLoading(true);

        // This builds a reverse geocoding request
        const url =
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          `${encodeURIComponent(lng)},${encodeURIComponent(lat)}.json` +
          "?types=poi,place,locality,neighborhood,address" +
          `&language=${encodeURIComponent(language)}` +
          `&access_token=${encodeURIComponent(mapboxToken)}`;

        const res = await fetch(url);

        if (!res.ok) {
          console.error("Reverse geocoding failed", res.status);
          return {
            fullLabel: "Zona no definida",
            shortLabel: "Zona no definida",
          };
        }

        const data = await res.json();
        const features = data?.features || [];
        const fullLabelRaw = features?.[0]?.place_name;

        // Instead of using raw full label, create clean version (street, city only)
        // This removes postal codes and country names for better UI display
        const fullLabel =
          fullLabelRaw &&
          typeof fullLabelRaw === "string" &&
          fullLabelRaw.trim() !== ""
            ? createCleanLabel(fullLabelRaw.trim())
            : "Zona no definida";

        const shortLabel = pickShortLabel(features) || "Zona no definida";

        return {
          fullLabel,
          shortLabel,
        };
      } catch (err) {
        console.error("Reverse geocoding error", err);
        return {
          fullLabel: "Zona no definida",
          shortLabel: "Zona no definida",
        };
      } finally {
        setLoading(false);
      }
    },
    [mapboxToken, currentLang]
  );

  return {
    reverseGeocode,
    loading,
    currentLang,
  };
};
