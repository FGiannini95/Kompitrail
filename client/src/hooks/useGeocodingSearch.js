import React, { useState, useEffect, useRef } from "react";

export const useGeocodingSearch = (query, debounceMs = 800) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeRef = useRef();
  const abortRef = useRef();

  // Function to search locations using ORS Geocoding API
  const searchLocation = async (searchQuery) => {};

  useEffect(() => {
    // Clear existing timers
    if (timeRef.current) clearTimeout(timeRef.current);

    // If query is empty or too short, clear results
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);

      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();

      return;
    }

    // Set up debounced search
    timeRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
    });

    return () => {};
  }, [query, debounceMs]);

  return { results, loading, error };
};
