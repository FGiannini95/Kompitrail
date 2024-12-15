import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { KompitrailContext } from '../../../context/KompitrailContext';
import { useNavigate } from 'react-router-dom';
import { delLocalStorage } from '../../helpers/localStorageUtils';

export const LogoutDelete = () => {
  const { user, token, setUser, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const navigate = useNavigate()

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate("/");
  };

  const deletePerfil = () => {
    console.log("hola");
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType("");
  };

  const handleConfirmation = () => {
    if (dialogType === "logout") {
      logOut();
    } else if (dialogType === "delete") {
      deletePerfil();
    }
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        {dialogType === "logout" ? "Cerrar sesión" : "Eliminar perfil"}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {dialogType === "logout"
            ? "¿Estás seguro de querer cerrar sesión?"
            : "Esta acción es irreversible. ¿Estás seguro de querer eliminar tu cuenta?"}
        </Typography>
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
  )
}
