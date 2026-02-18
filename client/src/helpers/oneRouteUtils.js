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
  const ONE_MINUTE_MS = 60 * 1000;
  const routeDurationMs = (Number(estimated_time) || 0) * ONE_MINUTE_MS;

  const routeEnd = new Date(routeStart.getTime() + routeDurationMs);
  const enrollmentDeadline = new Date(routeStart.getTime() - ONE_HOUR_MS);

  const isPastRoute = now >= routeEnd;
  // isEnrollmentClosed is true from 1h before the start till the end of the route
  const isEnrollmentClosed = now >= enrollmentDeadline && now < routeEnd;
  const isRouteLocked = isPastRoute || isEnrollmentClosed;

  return { isPastRoute, isEnrollmentClosed, isRouteLocked, routeEnd };
};

export const getEnrollmentStatus = (route, currentUserId) => {
  const { participants = [], max_participants, user_id: creatorId } = route;
  // Creator + enrolled user
  const currentParticipants = 1 + participants.length;

  const slotsAvailable = max_participants - currentParticipants;
  const isRouteFull = slotsAvailable <= 0;

  // Check if current user is already enrolled
  const isCurrentUserEnrolled = participants.some(
    (p) => p.user_id === currentUserId,
  );
  const isOwner = creatorId === currentUserId;
  const canJoinRoute = !isOwner && !isCurrentUserEnrolled && !isRouteFull;

  return {
    currentParticipants,
    isRouteFull,
    isCurrentUserEnrolled,
    isOwner,
    canJoinRoute,
    slotsAvailable,
    emptySlotsCount: Math.max(0, slotsAvailable),
  };
};
