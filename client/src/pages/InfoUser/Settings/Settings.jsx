import React, { useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { Box, Typography, IconButton, List } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// Utils
import { RoutesString } from "../../../routes/routes";
import {
  getLocalStorage,
  delLocalStorage,
} from "../../../helpers/localStorageUtils";
import { USERS_URL } from "../../../api";
// Providers & Hooks
import { KompitrailContext } from "../../../context/KompitrailContext";
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
// Components
import { SettingsRow } from "./SettingsRow/SettingsRow";

export const Settings = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();

  const deleteProfile = () => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .put(`${USERS_URL}/deleteuser/${user_id}`)
      .then(() => {
        logOut();
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

  const handleDeleteProfile = () => {
    openDialog({
      title: "Eliminar cuenta",
      message:
        "Esta acción es irreversible. ¿Estás seguro de querer eliminar tu cuenta?",
      onConfirm: () => deleteProfile(),
    });
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
            action="changePassword"
            onClick={() => navigate(RoutesString.editPassword)}
          />
          {/* Delete Account Option */}
          <SettingsRow action="deleteAccount" onClick={handleDeleteProfile} />
        </List>
      </Box>
    </Grid>
  );
};
