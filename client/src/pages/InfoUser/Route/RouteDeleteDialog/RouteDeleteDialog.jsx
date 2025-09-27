import React from "react";

// MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";

export const RouteDeleteDialog = ({
  openDeleteDialog,
  handleCloseDialog,
  route_id,
  handleOpenSnackbar,
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    axios
      .put(`${ROUTES_URL}/deleteroute/${route_id}`)
      .then(() => {
        handleOpenSnackbar("Ruta eliminada con éxito");
        // Deley the closing in order to displayu the snackbar
        setTimeout(() => {
          handleCloseDialog();
          navigate(-1);
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
      <DialogTitle>Eliminar ruta</DialogTitle>
      <DialogContent>
        <Typography>¿Quieres eliminar la ruta de tu perfil?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Cancelar
        </Button>
        <Button onClick={handleConfirm}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};
