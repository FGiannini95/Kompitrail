import React, { useContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
import { ChangeLanguageDialog } from "./ChangeLanguageDialog/ChangeLanguageDialog";
import { DialogPwa } from "../../../components/Dialogs/DialogPwa/DialogPwa";

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
export const Settings = ({ toggleMode, mode, language, changeLanguage }) => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isPwaDialogOpen, setIsPwaDialogOpen] = useState(false);
  const [isNotificationsDialogOpen, setIsNotificationsDialogOpen] =
    useState(false);

  const { t } = useTranslation(["general", "dialogs"]);

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
      title: t("dialogs:accountDeleteTitle"),
      message: t("dialogs:accountDeleteText"),
      onConfirm: () => deleteProfile(),
    });
  };

  const handleOpenThemeDialog = () => setIsThemeDialogOpen(true);
  const handleCloseThemeDialog = () => setIsThemeDialogOpen(false);

  const handleOpenLanguageDialog = () => setIsLanguageDialogOpen(true);
  const handleCloseLanguageDialog = () => setIsLanguageDialogOpen(false);

  const handleOpenPwaDialog = () => setIsPwaDialogOpen(true);
  const handleClosePwaDialog = () => setIsPwaDialogOpen(false);

  const handleOpenNotificationsDialog = () =>
    setIsNotificationsDialogOpen(true);
  const handleCloseNotificationsDialog = () =>
    setIsNotificationsDialogOpen(false);

  return (
    <Grid container direction="column" spacing={2}>
      {/* Header */}
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          {t("general:settingsTitle")}
        </Typography>
      </Grid>

      <Section>
        <SettingsRow action="language" onClick={handleOpenLanguageDialog} />
        <SettingsRow action="theme" onClick={handleOpenThemeDialog} />
        <SettingsRow action="pwa" onClick={handleOpenPwaDialog} />

        <SettingsRow
          action="changePassword"
          onClick={() => navigate(RoutesString.editPassword)}
        />
        <SettingsRow
          action="notifications"
          onClick={handleOpenNotificationsDialog}
        />

        <SettingsRow action="deleteAccount" onClick={handleDeleteProfile} />
      </Section>

      <ModeToggleDialog
        open={isThemeDialogOpen}
        onClose={handleCloseThemeDialog}
        onToggle={toggleMode}
        currentMode={mode}
      />

      <ChangeLanguageDialog
        open={isLanguageDialogOpen}
        onClose={handleCloseLanguageDialog}
        language={language}
        changeLanguage={changeLanguage}
      />

      <DialogPwa open={isPwaDialogOpen} onClose={handleClosePwaDialog} />
      {/* <NotificationsDialog open={isNotificationsDialogOpen} onClose={handleCloseNotificationsDialog}/> */}
    </Grid>
  );
};
