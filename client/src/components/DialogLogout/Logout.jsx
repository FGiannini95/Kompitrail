import React, { useContext, useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { useNavigate } from "react-router-dom";
import { delLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";

export const Logout = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmation = () => {
    logOut();
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Cerrar sesión</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de querer cerrar sesión?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Cancelar
        </Button>
        <Button onClick={handleConfirmation} color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
