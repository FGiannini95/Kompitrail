import { useState, useEffect, useMemo } from "react";
import { ROUTES_URL } from "../api";
import { calculateDistance } from "../helpers/calculateDistance";

// Hook to get and manage turn-by-turn navigation instructions
// Fetches from backend and determines current instruction based on GPS positio

export const useNavigationInstructions = (routeData, currentPosition) => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch navigation instructions from backend when route data is available
  useEffect(() => {
    if (!routeData || !routeData.starting_lat) return;

    const fetchInstructions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build coordinates array
        const coordinates = [
          { lng: routeData.starting_lng, lat: routeData.starting_lat },
          ...(routeData.waypoints || []),
          { lng: routeData.ending_lng, lat: routeData.ending_lat },
        ];

        // Call our backend navigation endpoint
        const response = await fetch(`${ROUTES_URL}/navigation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coordinates }),
        });

        if (!response.ok) {
          throw new Error(`Navigation API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Failed to get navigation instructions",
          );
        }

        setInstructions(data.route.instructions);
      } catch (err) {
        console.error("Navigation instructions error", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [routeData]);

  // Find current instruction based on GPS position
  const currentInstruction = useMemo(() => {
    if (!currentPosition || !instructions.length) {
      return { type: "loading" };
    }

    // Find next instruction user hasn't reached yet
    for (const step of instructions) {
      const distanceKm = calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        step.location[1],
        step.location[0],
      );

      // Skip instructions we've already passed
      if (distanceKm < 0.05) continue;

      // Found next instruction
      const distanceMeters = Math.round(distanceKm * 1000);

      return {
        type: "instruction",
        text: step.instruction,
        distance:
          distanceMeters > 1000 ? distanceKm.toFixed(1) : distanceMeters,
        unit: distanceMeters > 1000 ? "km" : "m",
        streetName: step.streetName,
      };
    }

    // All instructions completed
    return { type: "completed" };
  }, [currentPosition, instructions]);

  return {
    instructions,
    currentInstruction,
    loading,
    error,
    totalSteps: instructions.length,
  };
};
