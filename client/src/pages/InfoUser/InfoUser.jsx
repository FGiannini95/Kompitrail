import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Typography, List } from "@mui/material";
import Grid from "@mui/material/Grid2";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// Utils
import { delLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";
import { getCurrentLang } from "../../helpers/oneRouteUtils";
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

const PRIVACY_URLS = {
  es: "/privacy/kompitrail_privacy_spanish.pdf",
  it: "/privacy/kompitrail_privacy_italian.pdf",
  en: "/privacy/kompitrail_privacy_english.pdf",
};

export const InfoUser = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [iframe, setiIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const { t, i18n } = useTranslation(["general", "dialogs"]);
  const currentLang = getCurrentLang(i18n);

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
      title: t("dialogs:logoutTitle"),
      message: t("dialogs:logoutText"),
      onConfirm: () => logOut(),
    });
  };

  const handleToggleIframe = () => {
    const url = PRIVACY_URLS[currentLang];

    setIframeUrl(url);
    setiIframe((prev) => !prev);
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
        pb: "25px",
      })}
    >
      <Grid>
        <CloseOutlinedIcon
          sx={(theme) => ({
            paddingLeft: "20px",
            cursor: "pointer",
            color: theme.palette.text.primary,
            fontSize: 40,
          })}
          onClick={handleClose}
        />
      </Grid>
      <UserAvatar />
      <Section title={t("general:titleSection1")}>
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

      <Section title={t("general:titleSection2")}>
        <SettingsRow
          action="chatbot"
          onClick={() => navigate(RoutesString.chatbot)}
        />
        <SettingsRow action="privacy" onClick={handleToggleIframe} />
      </Section>

      <Section title={t("general:titleSection3")}>
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
