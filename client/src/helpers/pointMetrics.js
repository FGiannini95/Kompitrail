// Utility functions for handling geographic points with i18n support
export const getPointLabel = (point, currentLang, type = "full") => {
  if (!point?.i18n) return "";

  const langData = point.i18n[currentLang] || point.i18n.es || {};
  return type === "short" ? langData.short : langData.full;
};

// Fetch reverse geocoded labels for a point in multiple languages
export async function fetchPointI18n(
  lat,
  lng,
  reverseGeocode,
  languages = ["es", "it", "en"]
) {
  const i18nResults = await Promise.all(
    languages.map(async (lang) => {
      const { fullLabel, shortLabel } = await reverseGeocode({
        lat,
        lng,
        language: lang,
      });

      return [lang, { full: fullLabel, short: shortLabel }];
    })
  );

  return Object.fromEntries(i18nResults);
}
