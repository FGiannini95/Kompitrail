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

export const MotorbikeDeleteDialog = ({
  openDeleteDialog,
  handleCloseDialog,
  motorbike_id,
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    axios
      .put(`http://localhost:3000/motorbikes/deletemotorbike/${motorbike_id}`)
      .then((res) => {
        console.log(res.data);
        handleCloseDialog();
        navigate(-1);
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
        <Button onClick={handleCloseDialog} color="primary">
          Cancelar
        </Button>
        <Button color="secondary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
