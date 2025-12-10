import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export const ConfirmationDialogContext = createContext();
// Helpful for debugging with ReactDev Tools
ConfirmationDialogContext.displayName = "ConfirmationDialogContext";

export const ConfirmationDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const { t } = useTranslation("dialogs");

  const openDialog = useCallback(({ title, message, onConfirm }) => {
    setConfig({ title, message, onConfirm });
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setConfig({ title: "", message: "", onConfirm: null });
  }, []);

  const handleConfirm = useCallback(() => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    closeDialog();
  }, [config.onConfirm, closeDialog]);

  const value = useMemo(
    () => ({
      openDialog,
      closeDialog,
    }),
    [openDialog, closeDialog]
  );

  return (
    <ConfirmationDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{config.title}</DialogTitle>
        <DialogContent>
          <Typography>{config.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="error">
            {t("buttons:cancel")}
          </Button>
          <Button color="success" onClick={handleConfirm}>
            {t("buttons:confirmar")}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = () => {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx)
    throw new Error(
      "useConfirmationDialog must be used within DeleteDialogProvider"
    );
  return ctx;
};
