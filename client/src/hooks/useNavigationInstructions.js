import { useState, useEffect, useMemo } from "react";
import { ROUTES_URL } from "../api";
import { calculateDistance } from "../helpers/calculateDistance";

// Hook to get and manage turn-by-turn navigation instructions
// Fetches from backend and determines current instruction based on GPS positio
export const useNavigationInstructions = (routeData, currentPosition) => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  // Fetch navigation instructions from backend when route data is available
  useEffect(() => {
    if (!routeData || !routeData.starting_lat) return;

    const fetchInstructions = async () => {
      setLoading(true);
      setError(null);
      setCurrentInstructionIndex(0);

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

  // Calculate distance to current instruction
  const currentInstructionData = useMemo(() => {
    if (
      !currentPosition ||
      !instructions.length ||
      currentInstructionIndex >= instructions.length
    ) {
      return null;
    }

    const instruction = instructions[currentInstructionIndex];
    const distanceKm = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      instruction.location[1], // lat
      instruction.location[0], // lng
    );

    const meters = Math.round(distanceKm * 1000);

    return {
      instruction,
      distanceKm,
      meters,
    };
  }, [currentPosition, instructions, currentInstructionIndex]);

  // Check if should advance to next instruction
  useEffect(() => {
    if (!currentInstructionData) return;

    const { meters } = currentInstructionData;

    // If very close to current instruction, advance to next
    if (meters < 50 && currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex((prev) => prev + 1);
    }
  }, [currentInstructionData, currentInstructionIndex, instructions.length]);

  // Calculate current instruction to display
  const currentInstruction = useMemo(() => {
    if (loading || !instructions.length) return { type: "loading" };
    if (currentInstructionIndex >= instructions.length)
      return { type: "completed" };
    if (!currentInstructionData) return { type: "loading" };

    const { instruction, distanceKm, meters } = currentInstructionData;

    return {
      type: "instruction",
      text: instruction.instruction,
      distance: meters > 1000 ? distanceKm.toFixed(1) : meters,
      unit: meters > 1000 ? "km" : "m",
      streetName: instruction.streetName,
    };
  }, [
    loading,
    instructions.length,
    currentInstructionIndex,
    currentInstructionData,
  ]);

  return {
    instructions,
    currentInstruction,
    loading,
    error,
    totalSteps: instructions.length,
    currentStep: currentInstructionIndex + 1,
  };
};
