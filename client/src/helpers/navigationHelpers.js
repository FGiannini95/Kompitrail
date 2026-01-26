import { calculateDistance } from "./calculateDistance";

//Find the next waypoint based on current position
export const findNextWaypoint = (currentPosition, waypoints = []) => {
  if (!currentPosition || !waypoints.length) return null;

  const REACHED_THRESHOLD = 0.05; // 50 meters = waypoint reached

  // Find first waypoint that hasn't been reached yet
  for (let i = 0; i < waypoints.length; i++) {
    const waypoint = waypoints[i];
    const distance = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      waypoint.lat,
      waypoint.lng
    );

    // If this waypoint hasn't been reached, it's the next one
    if (distance > REACHED_THRESHOLD) {
      return { ...waypoint, index: i, distance };
    }
  }

  // All waypoints reached
  return null;
};

export const getNextWaypointData = (currentPosition, waypoints) => {
  const nextWaypoint = findNextWaypoint(currentPosition, waypoints);
  if (!nextWaypoint) return null;

  const distanceKm = nextWaypoint.distance;
  const distanceM = Math.round(distanceKm * 1000);

  return {
    waypointNumber: nextWaypoint.index + 1,
    distance: distanceM > 1000 ? distanceKm.toFixed(1) : distanceM,
    unit: distanceM > 1000 ? "km" : "m",
  };
};
