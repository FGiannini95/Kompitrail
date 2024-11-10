import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export const MotorbikeDialog = ({ openDialog, handleCloseDialog }) => {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Añadir moto</DialogTitle>
      <DialogContent>
        <Typography>
          Aquí va el formulario para agregar o modificar una moto.
        </Typography>
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
