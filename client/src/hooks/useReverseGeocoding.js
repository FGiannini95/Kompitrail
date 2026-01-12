import { useCallback, useState } from "react";
import { getCurrentLang } from "../helpers/oneRouteUtils";
import { useTranslation } from "react-i18next";

// Encapsulates Mapbox reverse geocoding logic: takes lat/lng and returns a human-readable label
export const useReverseGeocoding = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const { i18n } = useTranslation("");

  const [loading, setLoading] = useState(false);
  const currentLang = getCurrentLang(i18n);

  const reverseGeocode = useCallback(
    async ({ lat, lng, language = currentLang }) => {
      if (!mapboxToken) return "Zona no definida";

      try {
        setLoading(true);

        // This builds a reverse geocoding request
        const url =
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          `${encodeURIComponent(lng)},${encodeURIComponent(lat)}.json` +
          "?types=poi,place,locality,neighborhood,address" +
          `&language=${language}` +
          `&access_token=${encodeURIComponent(mapboxToken)}`;

        const res = await fetch(url);

        if (!res.ok) {
          console.error("Reverse geocoding failed", res.status);
          return "Zona no definida";
        }

        const data = await res.json();

        const best = data?.features?.[0]?.place_name;
        if (best && typeof best === "string" && best.trim() !== "") {
          return best;
        }

        return "Zona no definida";
      } catch (err) {
        console.error("Reverse geocoding error", err);
        return "Zona no definida";
      } finally {
        setLoading(false);
      }
    },
    [mapboxToken]
  );

  return {
    reverseGeocode,
    loading,
  };
};
