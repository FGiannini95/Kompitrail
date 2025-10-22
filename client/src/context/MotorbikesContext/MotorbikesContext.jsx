import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import axios from "axios";

import { MOTORBIKES_URL } from "../../../../server/config/serverConfig";

export const MotorbikesContext = createContext();
// Helpful for debugging with ReactDev Tools
MotorbikesContext.displayName = "MotorbikesContext";

export const MotorbikesProvider = ({ children }) => {
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({
    isOpen: false,
    mode: null,
    selectedId: null,
  });

  const openDialog = useCallback(({ mode, motorbike_id = null }) => {
    setDialog({ isOpen: true, mode, selectedId: motorbike_id });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog({ isOpen: false, mode: null, selectedId: null });
  }, []);

  const loadMotorbikes = useCallback((user_id) => {
    setLoading(true);
    axios
      .get(`${MOTORBIKES_URL}/showallmotorbikes/${user_id}`)
      .then((res) => {
        setAllMotorbikes(res.data);
      })
      .catch((err) => {
        console.log(err);
        setAllMotorbikes([]);
      })
      .finally(() => {
        setLoading(false);
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

  const value = useMemo(
    () => ({
      allMotorbikes,
      loadMotorbikes,
      createMotorbike,
      editMotorbike,
      deleteMotorbike,
      dialog,
      openDialog,
      closeDialog,
      loading,
    }),
    [
      allMotorbikes,
      loadMotorbikes,
      createMotorbike,
      editMotorbike,
      deleteMotorbike,
      dialog,
      openDialog,
      closeDialog,
      loading,
    ]
  );

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
