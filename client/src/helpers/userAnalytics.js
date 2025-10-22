import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Utils
import { getLocalStorage } from "./localStorageUtils";
import {
  MOTORBIKES_URL,
  ROUTES_URL,
} from "../../../server/config/serverConfig";

export const userAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    motorbikes: null,
    createdRoutes: null,
    joinedRoutes: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const tokenLocalStorage = getLocalStorage("token");
        const { user_id } = jwtDecode(tokenLocalStorage).user;

        const [motorbikesRes, createdRoutesRes, joinedRutesRes] =
          await Promise.all([
            axios.get(`${MOTORBIKES_URL}/motorbikes-analytics/${user_id}`),
            axios.get(`${ROUTES_URL}/createdroutes-analytics/${user_id}`),
            axios.get(`${ROUTES_URL}/joinedroutes-analytics/${user_id}`),
          ]);

        setAnalytics({
          motorbikes: motorbikesRes.data[0],
          createdRoutes: createdRoutesRes.data[0],
          joinedRoutes: joinedRutesRes.data[0],
          loading: false,
          error: null,
        });
      } catch (err) {
        console.log("Error fetching analytics:", err);
        setAnalytics((prev) => ({
          ...prev,
          loading: false,
          error: err,
        }));
      }
    };
    fetchAnalytics();
  }, []);

  return analytics;
};
