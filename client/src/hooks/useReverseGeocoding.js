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
        const fullLabel =
          typeof fullLabelRaw === "string" && fullLabelRaw.trim() !== ""
            ? fullLabelRaw.trim()
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
