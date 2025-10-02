import axios from "axios";
import React, { createContext, useCallback, useContext, useState } from "react";
import { ROUTES_URL } from "../../../../server/config/serverConfig";

export const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);

  const [dialog, setDialog] = useState({
    isOpen: false,
    mode: null,
    selectedId: null,
  });

  const openDialog = ({ mode, route_id = null }) => {
    setDialog({ isOpen: true, mode, selectedId: route_id });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, mode: null, route_id: null });
  };

  const loadAllRoutes = useCallback(() => {
    axios
      .get(`${ROUTES_URL}/showallroutes`)
      .then((res) => setAllRoutes(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const loadUserRoutes = useCallback((user_id) => {
    axios
      .get(`${ROUTES_URL}/showallroutesoneuser/${user_id}`)
      .then((res) => {
        setUserRoutes(res.data);
      })
      .catch((err) => {
        console.log(err);
        setUserRoutes([]);
      });
  }, []);

  const createRoute = useCallback((route) => {
    setUserRoutes((prev) => [route, ...prev]);
    setAllRoutes((prev) => [route, ...prev]);
  }, []);

  const editRoute = useCallback((updateRoute) => {}, []);

  const deleteRoute = useCallback((route_id) => {
    setAllRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
    setUserRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
  }, []);

  const value = {
    allRoutes,
    userRoutes,
    dialog,
    openDialog,
    closeDialog,
    loadAllRoutes,
    loadUserRoutes,
    createRoute,
    editRoute,
    deleteRoute,
  };

  return (
    <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>
  );
};

export const useRoutes = () => {
  const ctx = useContext(RoutesContext);
  if (!ctx) {
    throw new Error("useRoutes must be used within RoutesProvider");
  }
  return ctx;
};
