import React, { useContext, useState } from "react";
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
import { ModeToggleDialog } from "./ModeToggleDialog/ModeToggleDialog";

function Section({ title, children }) {
  return (
    <Box
      sx={(theme) => ({
        p: "10px",
        bgcolor: theme.palette.kompitrail.card,
        mx: "10px",
        borderRadius: "20px",
      })}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", pb: 1, color: "text.primary" }}
      >
        {title}
      </Typography>
      <List disablePadding>{children}</List>
    </Box>
  );
}
export const Settings = ({ toggleMode, mode }) => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

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

  const handleOpenThemeDialog = () => setIsThemeDialogOpen(true);
  const handleCloseThemeDialog = () => setIsThemeDialogOpen(false);

  return (
    <Grid container direction="column" spacing={2}>
      {/* Header */}
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          Ajustes
        </Typography>
      </Grid>

      <Section>
        <SettingsRow
          action="language"
          onClick={() => navigate(RoutesString.language)}
        />
        <SettingsRow action="theme" onClick={handleOpenThemeDialog} />
        <SettingsRow
          action="changePassword"
          onClick={() => navigate(RoutesString.editPassword)}
        />
        <SettingsRow action="deleteAccount" onClick={handleDeleteProfile} />
      </Section>

      <ModeToggleDialog
        open={isThemeDialogOpen}
        onClose={handleCloseThemeDialog}
        onToggle={toggleMode}
        currentMode={mode}
      />
    </Grid>
  );
};
