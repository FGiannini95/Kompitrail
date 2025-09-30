import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export const ConfirmationDialogContext = createContext();

export const ConfirmationDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const openDialog = ({ title, message, onConfirm }) => {
    setConfig({ title, message, onConfirm });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setConfig({ title: "", message: "", onConfirm: null });
  };

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    closeDialog();
  };

  const value = {
    openDialog,
    closeDialog,
  };

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
            Cancelar
          </Button>
          <Button color="success" onClick={handleConfirm}>
            Confirmar
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
