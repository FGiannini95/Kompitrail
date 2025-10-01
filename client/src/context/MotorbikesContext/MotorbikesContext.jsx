import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

import { MOTORBIKES_URL } from "../../../../server/config/serverConfig";

export const MotorbikesContext = createContext();

export const MotorbikesProvider = ({ children }) => {
  const [allMotorbikes, setAllMotorbikes] = useState([]);

  const loadMotorbikes = useCallback((user_id) => {
    axios
      .get(`${MOTORBIKES_URL}/showallmotorbikes/${user_id}`)
      .then((res) => {
        setAllMotorbikes(res.data);
      })
      .catch((err) => {
        console.log(err);
        setAllMotorbikes([]);
      });
  }, []);

  const createMotorbike = useCallback((motorbike) => {
    setAllMotorbikes((prev) => [motorbike, ...prev]);
  }, []);

  const editMotorbike = useCallback((updatedMotorbike) => {
    setAllMotorbikes((prev) =>
      prev.map((motorbike) =>
        motorbike.motorbike_id === updatedMotorbike.motorbike_id
          ? { ...motorbike, ...updatedMotorbike }
          : motorbike
      )
    );
  }, []);

  const deleteMotorbike = useCallback((motorbike_id) => {
    setAllMotorbikes((prev) =>
      prev.filter((x) => x.motorbike_id !== motorbike_id)
    );
  }, []);

  const value = {
    allMotorbikes,
    loadMotorbikes,
    createMotorbike,
    editMotorbike,
    deleteMotorbike,
  };

  return (
    <MotorbikesContext.Provider value={value}>
      {children}
    </MotorbikesContext.Provider>
  );
};

export const useMotorbikes = () => {
  const ctx = useContext(MotorbikesContext);
  if (!ctx) {
    throw new Error("useMotorbikes must be used with MotorbikesProvider");
  }
  return ctx;
};
