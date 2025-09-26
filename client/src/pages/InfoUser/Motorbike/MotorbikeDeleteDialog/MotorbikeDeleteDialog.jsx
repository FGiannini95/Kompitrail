import React from "react";

// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MOTORBIKES_URL } from "../../../../../../server/config/serverConfig";

export const MotorbikeDeleteDialog = ({
  openDeleteDialog,
  handleCloseDialog,
  motorbike_id,
  handleOpenSnackbar,
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    axios
      .put(`${MOTORBIKES_URL}/deletemotorbike/${motorbike_id}`)
      .then(() => {
        handleOpenSnackbar("Moto eliminada con éxito");
        // Delay the closing in order to see the snackbar
        setTimeout(() => {
          handleCloseDialog();
          navigate(-1);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
      <DialogTitle>Eliminar moto</DialogTitle>
      <DialogContent>
        <Typography>¿Quieres eliminar la moto de tu perfil?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Cancelar
        </Button>
        <Button color="success" onClick={handleConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
