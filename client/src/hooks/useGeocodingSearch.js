import { useState, useEffect, useRef } from "react";

export const useGeocodingSearch = (
  query,
  endpointUrl,
  language,
  debounceMs = 800
) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const abortRef = useRef(null);

  // Function to search locations using our backend
  const searchLocations = async (searchQuery, language) => {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchQuery, language: language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Search error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  };

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // If query is empty or too short, clear results
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);

      // Cancel any in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      return;
    }

    // Set up debounced search
    timerRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchLocations(query.trim(), language);

        // Only update if request wasn't aborted
        if (!controller.signal.aborted) {
          setResults(searchResults);
        }
      } catch (err) {
        // Only handle error if request wasn't aborted
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Geocoding search error:", err);
          setError(err.message);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, endpointUrl, language, debounceMs]);

  return { results, loading, error };
};
