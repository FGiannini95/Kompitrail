import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid2 as Grid, Typography, List } from "@mui/material";

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
      sx={{
        mt: "30px",
        p: "10px",
        bgcolor: "#eeeeee",
        mx: "10px",
        borderRadius: "20px",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", pb: 1 }}>
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
      sx={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      <Grid>
        <CloseOutlinedIcon
          sx={{ paddingLeft: "20px", cursor: "pointer" }}
          onClick={handleClose}
        />
      </Grid>
      <UserAvatar />
      {/* <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ p: "10px" }}
      >
        <Button
          type="button"
          variant="contained"
          sx={{
            color: "black",
            boxShadow: "none",
            backgroundColor: "#eeeeee",
            "&:hover": { backgroundColor: "#dddddd" },
          }}
          fullWidth
        >
          Ir a premium
        </Button>
      </Stack> */}
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
