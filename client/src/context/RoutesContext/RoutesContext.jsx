import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ROUTES_URL } from "../../api";
import { getCurrentLang } from "../../helpers/oneRouteUtils";

export const RoutesContext = createContext();

RoutesContext.displayName = "RoutesContext";

export const RoutesProvider = ({ children }) => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track if initial load has completed
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  // Track per route ids to block double clicks
  const [joiningRouteId, setJoiningRouteId] = useState(() => new Set());
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = getCurrentLang(i18n);

  // Reset the value when there is a navigation
  useEffect(() => {
    setExpandedRouteId(null);
  }, [location.pathname]);

  const [dialog, setDialog] = useState({
    isOpen: false,
    mode: null,
    selectedId: null,
    routeData: null,
  });

  const openDialog = useCallback(
    ({ mode, route_id = null, routeData = null }) => {
      setDialog({ isOpen: true, mode, selectedId: route_id, routeData });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialog({ isOpen: false, mode: null, selectedId: null, routeData: null });
  }, []);

  const loadAllRoutes = useCallback(
    (options = {}) => {
      const { silent = false } = options;
      // Only show loading spinner if this is not a silent refresh
      if (!silent) {
        setLoading(true);
      }

      axios
        .get(`${ROUTES_URL}/showallroutes`)
        .then((res) => setAllRoutes(res.data))
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (!silent) {
            setLoading(false);
          }
          setHasLoadedOnce(true); // track that we loaded at least once
        });
    },
    [currentLang],
  );

  const loadUserRoutes = useCallback((user_id) => {
    setLoading(true);

    axios
      .get(`${ROUTES_URL}/showallroutesoneuser/${user_id}`)
      .then((res) => {
        setUserRoutes(res.data);
      })
      .catch((err) => {
        console.log(err);
        setUserRoutes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Poll routes periodically, every 15s, to keep all clients in sync
  useEffect(() => {
    // First load: show spinner, with current language
    loadAllRoutes({ language: currentLang });

    const interval = setInterval(() => {
      // Background refresh: no spinner, no visual flicker
      loadAllRoutes({ silent: true, language: currentLang });
    }, 15000);

    return () => clearInterval(interval);
  }, [loadAllRoutes, currentLang]);

  // CREATE action
  const createRoute = useCallback((route) => {
    setUserRoutes((prev) => [route, ...prev]);
    setAllRoutes((prev) => [route, ...prev]);
  }, []);

  // EDIT action
  const editRoute = useCallback((updateRoute) => {
    const apply = (array) =>
      array.map((a) =>
        a.route_id === updateRoute.route_id ? { ...a, ...updateRoute } : a,
      );

    setUserRoutes(apply);
    setAllRoutes(apply);
  }, []);

  // DELETE action
  const deleteRoute = useCallback((route_id, user_id) => {
    return axios
      .put(`${ROUTES_URL}/deleteroute/${route_id}`, { user_id })
      .then(() => {
        setAllRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
        setUserRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }, []);

  // JOIN action
  const joinRoute = useCallback(
    (route_id, user_id) => {
      // Lock this route id
      setJoiningRouteId((prev) => {
        const next = new Set(prev);
        next.add(route_id);
        return next;
      });

      return axios
        .post(`${ROUTES_URL}/join/${route_id}`, { user_id })
        .then(() => {
          loadAllRoutes({ silent: true });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setJoiningRouteId((prev) => {
            const next = new Set(prev);
            next.delete(route_id);
            return next;
          });
        });
    },
    [loadAllRoutes],
  );

  // Helper to know if a specific route is currently joining
  const isJoiningRoute = useCallback(
    (route_id) => joiningRouteId.has(route_id), // <-- return the boolean
    [joiningRouteId],
  );

  // LEAVE action
  const leaveRoute = useCallback(
    (route_id, user_id) => {
      return axios
        .delete(`${ROUTES_URL}/leave/${route_id}`, {
          data: { user_id },
        })
        .then(() => {
          loadAllRoutes({ silent: true });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [loadAllRoutes],
  );

  const value = useMemo(
    () => ({
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
      expandedRouteId,
      loading,
      joinRoute,
      isJoiningRoute,
      leaveRoute,
    }),
    [
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
      expandedRouteId,
      loading,
      joinRoute,
      isJoiningRoute,
      leaveRoute,
    ],
  );

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
