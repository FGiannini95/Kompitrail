import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, List } from "@mui/material";
import Grid from "@mui/material/Grid2";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
const url =
  "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf";
// Utils
import { delLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";
// Providers & Hooks
import { KompitrailContext } from "../../context/KompitrailContext";
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";
// Components
import { SettingsRow } from "./Settings/SettingsRow/SettingsRow";
import { PrivacyDialog } from "./Privacy/PrivacyDialog";
import { UserAvatar } from "../../components/Avatars/UserAvatar/UserAvatar";

function Section({ title, children }) {
  return (
    <Box
      sx={(theme) => ({
        mt: "30px",
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
const RETURN_KEY = "infoUser:returnTo";

export const InfoUser = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [iframe, setiIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  const navigate = useNavigate();
  const { openDialog } = useConfirmationDialog();

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  const handleLogOut = () => {
    openDialog({
      title: "Cerrar sessión",
      message: "¿Estás seguro de querer cerrar sessión?",
      onConfirm: () => logOut(),
    });
  };

  const handleToggleIframe = (url) => {
    setIframeUrl(url);
    setiIframe(!iframe);
  };

  const handleClose = () => {
    const target = sessionStorage.getItem(RETURN_KEY) || "/";
    sessionStorage.removeItem(RETURN_KEY);
    navigate(target, { replace: true });
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.kompitrail.page,
        py: "25px",
      })}
    >
      <Grid>
        <CloseOutlinedIcon
          sx={(theme) => ({
            paddingLeft: "20px",
            cursor: "pointer",
            color: theme.palette.text.primary,
          })}
          onClick={handleClose}
        />
      </Grid>
      <UserAvatar />
      <Section title="Mi cuenta">
        <SettingsRow
          action="editAccount"
          onClick={() => navigate(RoutesString.editUser)}
        />
        <SettingsRow
          action="addMotorbike"
          onClick={() => navigate(RoutesString.motorbike)}
        />
        <SettingsRow
          action="addRoute"
          onClick={() => navigate(RoutesString.route)}
        />
        <SettingsRow
          action="changeSettings"
          onClick={() => navigate(RoutesString.settings)}
        />
      </Section>

      <Section title="Ayuda y Soporte">
        <SettingsRow
          action="chatbot"
          onClick={() => navigate(RoutesString.settings)}
        />
        <SettingsRow action="privacy" onClick={() => handleToggleIframe(url)} />
      </Section>

      <Section title="Desconectar perfil">
        <SettingsRow action="logout" onClick={handleLogOut} />
      </Section>
      <PrivacyDialog
        openIframe={iframe}
        handleCloseIframe={() => setiIframe(false)}
        iframeUrl={iframeUrl}
      />
    </Box>
  );
};
