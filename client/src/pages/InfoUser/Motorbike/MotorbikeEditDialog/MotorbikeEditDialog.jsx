import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export const MotorbikeEditDialog = ({ openEditDialog, handleCloseDialog }) => {
  return (
    <Dialog open={openEditDialog} onClose={handleCloseDialog}>
      <DialogTitle>Editar moto</DialogTitle>
      <DialogContent>
        <Typography>¿Quieres eliminar la moto de tu perfil?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancelar
        </Button>
        <Button color="secondary">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};
