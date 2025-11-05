import React, { useEffect, useState } from "react";
import axios from "axios";

import { MOTORBIKES_URL, ROUTES_URL, USERS_URL } from "../api";

export const useOtherUserProfile = (otherUserId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't fetch it otherUserId is not provided
    if (!otherUserId) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchOtherUserProfile = async () => {
      setLoading(true);

      try {
        // Parallel API calls to fetch all necessary data
        const [
          userRes,
          motorbikeAnalyticRes,
          createdRoutesRes,
          joinedRutesRes,
          routeRes,
          frequentCompanionRes,
        ] = await Promise.all([
          axios.get(`${USERS_URL}/oneuser/${otherUserId}`),
          axios.get(`${MOTORBIKES_URL}/motorbikes-analytics/${otherUserId}`),
          axios.get(`${ROUTES_URL}/createdroutes-analytics/${otherUserId}`),
          axios.get(`${ROUTES_URL}/joinedroutes-analytics/${otherUserId}`),
          axios.get(`${ROUTES_URL}/showallroutesoneuser/${otherUserId}`),
          axios.get(`${ROUTES_URL}/frequent-companions/${otherUserId}`),
        ]);

        const user = userRes.data;
        const motorbikesAnalytics = motorbikeAnalyticRes.data[0];
        const createdRoutesAnalytics = createdRoutesRes.data[0];
        const joinedRoutesAnalytics = joinedRutesRes.data[0];
        const routes = Array.isArray(routeRes.data)
          ? routeRes.data // If it is an Array we use it
          : routeRes.data // If it is exists
            ? [routeRes.data] // We convert into an array
            : [];

        const companions = frequentCompanionRes.data;

        // Consolidate all data into a single object
        setData({
          user: user,
          motorbikes: motorbikesAnalytics,
          createdRoutes: createdRoutesAnalytics,
          joinedRoutes: joinedRoutesAnalytics,
          routes,
          companions: companions || [],
        });
      } catch (err) {
        console.log("Error fetching other user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOtherUserProfile();
  }, [otherUserId]);

  return { data, loading };
};
