import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { getLocalStorage } from "../helpers/localStorageUtils";
import { ROUTES_URL } from "../api";

export const useFrequentCompanions = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const tokenLocalStorage = getLocalStorage("token");
        const { user_id } = jwtDecode(tokenLocalStorage).user;

        const response = await axios.get(
          `${ROUTES_URL}/frequent-companions/${user_id}`
        );

        setCompanions(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanions();
  }, []);

  return { companions, loading, error };
};
