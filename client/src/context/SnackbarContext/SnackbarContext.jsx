import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Alert, Snackbar } from "@mui/material";

export const SnackbarContext = createContext();

SnackbarContext.displayName = "SnackbarContext";

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [snackbarKey, setSnackbarKey] = useState(0);

  const showSnackbar = useCallback((message, severity = "success") => {
    setMessage(message);
    setSeverity(severity);
    setSnackbarKey((prev) => prev + 1);
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      showSnackbar,
      closeSnackbar,
    }),
    [showSnackbar, closeSnackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={snackbarKey}
        open={open}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return ctx;
};
