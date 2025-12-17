// Map external language to date-fns locale string
export const LOCALE_MAP = {
  es: "es-ES",
  en: "en-GB",
  it: "it-IT",
};

//  Get normalized language code ("es" | "en" | "it") from i18n.
export const getCurrentLang = (i18n) => {
  i18n.language?.slice(0, 2) || "es";
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
