import React, { useContext, useState } from "react";

// MUI
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
} from "@mui/material";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { KompitrailContext } from "../../../context/KompitrailContext";
import { RoutesString } from "../../../routes/routes";
import {
  getLocalStorage,
  delLocalStorage,
} from "../../../helpers/localStorageUtils";
import { USERS_URL } from "../../../../../server/config/serverConfig";
import { SettingsRow } from "./SettingsRow/SettingsRow";

export const Settings = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [dialog, setDialog] = useState(false);
  const tokenLocalStorage = getLocalStorage("token");

  const handleToggleDialog = () => {
    setDialog(!dialog);
  };

  const handleConfirmation = () => {
    deleteUser();
    logOut();
    setDialog(false);
  };

  const deleteUser = () => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .put(`${USERS_URL}/deleteuser/${user_id}`)
      .then((res) => {
        navigate(RoutesString.landing);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/* Header */}
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon sx={{ color: "black" }} />
          <Typography variant="h6" sx={{ color: "black" }}>
            Ajustes
          </Typography>
        </IconButton>
      </Grid>
      {/* Settings Card */}
      <Box
        sx={{
          mt: 2,
          mx: 2,
          p: 2,
          pl: 3,
          bgcolor: "#eeeeee",
          borderRadius: 2,
          boxSizing: "border-box",
          width: "calc(100% - 22px)",
        }}
      >
        <List disablePadding>
          {/* Change Password Option */}
          <SettingsRow
            type="password"
            onPasswordClick={() => navigate(RoutesString.editPassword)}
          />
          {/* Delete Account Option */}
          <SettingsRow type="delete" onDeleteClick={handleToggleDialog} />
        </List>
        {/* Delete Account Dialog */}
        <Dialog open={dialog} onClose={handleToggleDialog}>
          <DialogTitle>Eliminar cuenta</DialogTitle>
          <DialogContent>
            <Typography>
              Esta acción es irreversible. ¿Estás seguro de querer eliminar tu
              cuenta?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleToggleDialog} color="error">
              Cancelar
            </Button>
            <Button onClick={handleConfirmation} color="success">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Grid>
  );
};
