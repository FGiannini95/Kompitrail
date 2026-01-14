// Map external language to date-fns locale string
export const LOCALE_MAP = {
  es: "es-ES",
  en: "en-GB",
  it: "it-IT",
};

// Gets a normalized 2-letter language code ("es", "en", "it") from i18n.
export const getCurrentLang = (i18n) => {
  // Take the current i18n language or fallback to Spanish
  const rawLang = i18n?.language || "es";

  // Normalize to first 2 characters (e.g. "en-GB" -> "en")
  const shortLang = rawLang.slice(0, 2);

  // Ensure the language is one of the supported ones
  if (!["es", "en", "it"].includes(shortLang)) {
    return "es";
  }

  return shortLang;
};

// Compute route temporal state: past, enrollment closed, locked.
export const getRouteStatus = (date, estimated_time) => {
  const now = new Date();
  const routeStart = new Date(date);

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const routeDurationMs = (Number(estimated_time) || 0) * ONE_HOUR_MS;

  const routeEnd = new Date(routeStart.getTime() + routeDurationMs);
  const enrollmentDeadline = new Date(routeStart.getTime() - ONE_HOUR_MS);

  const isPastRoute = now >= routeEnd;
  // isEnrollmentClosed is true from 1h before the start till the end of the route
  const isEnrollmentClosed = now >= enrollmentDeadline && now < routeEnd;
  const isRouteLocked = isPastRoute || isEnrollmentClosed;

  return { isPastRoute, isEnrollmentClosed, isRouteLocked, routeEnd };
};

// Resolve Mapbox reverse geocoding for multiple languages in parallel.
// Returns an object like: { es: { full: "...", short: "..." }, it: { ... }, en: { ... } }

export async function reverseGeocodeI18n({
  reverseGeocode,
  lat,
  lng,
  languages,
}) {
  const results = await Promise.all(
    languages.map(async (lang) => {
      const { fullLabel, shortLabel } = await reverseGeocode({
        lat,
        lng,
        language: lang,
      });

      return [
        lang,
        {
          full: fullLabel,
          short: shortLabel,
        },
      ];
    })
  );

  return Object.fromEntries(results);
}
