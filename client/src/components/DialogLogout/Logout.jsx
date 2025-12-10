import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { KompitrailContext } from "../../../context/KompitrailContext";
import { useNavigate } from "react-router-dom";
import { delLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";

export const Logout = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("dialogs");

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
      <DialogTitle>{t("dialogs:logoutTitle")}</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de querer cerrar sesión?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          {t("dialogs:cancelActionButton")}
        </Button>
        <Button onClick={handleConfirmation} color="success">
          {t("dialogs:confirmActionButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
