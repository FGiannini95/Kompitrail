import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  Typography,
} from "@mui/material";

export const ModeToggleDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cambiar tema</DialogTitle>
      <DialogContent>
        <Switch /> <Typography>dark or ligh</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
