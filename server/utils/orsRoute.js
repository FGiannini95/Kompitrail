const axios = require("axios");

/**
 * This function receives only the start and end points (and optionally waypoints),
 * 1. The function builds a coordinates array using start and end (and waypoints if provided).
 * 2. These coordinates are sent to OpenRouteService (ORS).
 * 3. ORS computes the FULL route:
 *    - the complete geometry (GeoJSON)
 *    - the total distance
 *    - the estimated duration
 * 4. ORS returns a GeoJSON response containing all these values.
 *
 * This function then:
 * - extracts the route geometry
 * - converts distance from meters to kilometers
 * - converts duration from seconds to minutes
 */

async function getOrsRouteGeojson(
  start,
  end,
  waypoints = [],
  profile = "cycling-mountain",
  preference = "recommended",
  avoidFeatures = ["ferries", "steps", "fords"],
  timeoutMs = 10000
) {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    const err = new Error("ORS Api key ausente");
    err.status = 500;
    throw err;
  }

  // Validate input
  if (
    !start ||
    !end ||
    typeof start.lat !== "number" ||
    typeof start.lng !== "number" ||
    typeof end.lat !== "number" ||
    typeof end.lng !== "number"
  ) {
    const err = new Error("Coordinadas incorrectas");
    err.status = 400;
    throw err;
  }

  // ORS expects coordinates as [lng, lat]
  // NOTE: waypoints are supported already, but we won't use them until the next step.
  const coordinates = [
    [start.lng, start.lat],
    ...waypoints.map((w) => [w.lng, w.lat]),
    [end.lng, end.lat],
  ];

  const orsBody = {
    coordinates,
    preference,
    options: {
      avoid_features: avoidFeatures,
    },
    extra_info: ["surface", "waytype"],
  };

  const response = await axios.post(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    orsBody,
    {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      timeout: timeoutMs,
    }
  );

  const feature = response.data?.features?.[0];
  if (!feature) {
    const err = new Error("Ruta no encontrada");
    err.status = 500;
    throw err;
  }

  const summary = feature.properties?.summary;
  const geometry = feature.geometry;

  if (!summary || !geometry) {
    const err = new Error("Ruta no encontrada");
    err.status = 500;
    throw err;
  }

  const distanceKm = Number((summary.distance / 1000).toFixed(2));
  const durationMinutes = Math.round(summary.duration / 60);

  return {
    profile,
    preference,
    avoid_features: avoidFeatures,
    distanceKm,
    durationMinutes,
    geometry,
    feature,
  };
}

module.exports = getOrsRouteGeojson;
