import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { ROUTES_URL } from "../../../../server/config/serverConfig";
import { useLocation } from "react-router-dom";

export const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track per route ids to block double clicks
  const [joiningRouteId, setJoiningRouteId] = useState(() => new Set());
  const location = useLocation();

  // Reset the value when there is a navigation
  useEffect(() => {
    setExpandedRouteId(null);
  }, [location.pathname]);

  const [dialog, setDialog] = useState({
    isOpen: false,
    mode: null,
    selectedId: null,
  });

  const openDialog = ({ mode, route_id = null }) => {
    setDialog({ isOpen: true, mode, selectedId: route_id });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, mode: null, selectedId: null });
  };

  const loadAllRoutes = useCallback(() => {
    setLoading(true);
    axios
      .get(`${ROUTES_URL}/showallroutes`)
      .then((res) => setAllRoutes(res.data))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  // CREATE action
  const createRoute = useCallback((route) => {
    setUserRoutes((prev) => [route, ...prev]);
    setAllRoutes((prev) => [route, ...prev]);
  }, []);

  // EDIT action
  const editRoute = useCallback((updateRoute) => {
    const apply = (array) =>
      array.map((a) =>
        a.route_id === updateRoute.route_id ? { ...a, ...updateRoute } : a
      );

    setUserRoutes(apply);
    setAllRoutes(apply);
  }, []);

  // DELETE action
  const deleteRoute = useCallback((route_id) => {
    setAllRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
    setUserRoutes((prev) => prev.filter((r) => r.route_id !== route_id));
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
          loadAllRoutes();
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
    [joiningRouteId, loadAllRoutes]
  );

  // Helper to know if a specific route is currently joining
  const isJoiningRoute = useCallback((route_id) => {
    joiningRouteId.has(route_id);
  }, []);

  // LEAVE action
  const leaveRoute = useCallback(
    (route_id, user_id) => {
      return axios
        .delete(`${ROUTES_URL}/leave/${route_id}`, {
          data: { user_id },
        })
        .then(() => {
          loadAllRoutes();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [loadAllRoutes]
  );

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
    expandedRouteId,
    loading,
    joinRoute,
    isJoiningRoute,
    leaveRoute,
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
