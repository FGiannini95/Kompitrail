import React, { useContext, useState } from "react";

import {
  Box,
  Grid2 as Grid,
  Typography,
  Button,
  Tooltip,
  List,
  Stack,
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const url =
  "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf";

import { delLocalStorage } from "../../helpers/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../context/KompitrailContext";
import { SettingsRow } from "./Settings/SettingsRow/SettingsRow";
import { PrivacyDialog } from "./Privacy/PrivacyDialog";
import { UserAvatar } from "../../components/UserAvatar/UserAvatar";
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";

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

export const InfoUser = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [iframe, setiIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
      message: "¿estás seguro de querer cerrar sessión?",
      onConfirm: () => logOut(),
    });
  };

  const handleToggleIframe = (url) => {
    setIframeUrl(url);
    setiIframe(!iframe);
  };

  const handleShare = async () => {
    try {
      const url = window.location.href; // Obtain the url
      await navigator.clipboard.writeText(url); // Copy the url
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar la URL:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      {/* Back/close icon */}
      <Grid>
        <CloseOutlinedIcon
          sx={{ paddingLeft: "20px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Grid>
      {/* User header */}
      <UserAvatar />
      {/* Buttons actions */}
      <Stack
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
        <Tooltip
          title="URL copiada"
          open={isCopied} // Display the tooltip only if isCopied is true
          disableInteractive // It doesn't appear with the interaction of the mouse
          arrow // Display the arrow
        >
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{
              color: "black",
              borderColor: "#eeeeee",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#dddddd",
                borderWidth: "2px",
              },
            }}
            onClick={handleShare}
          >
            Compartir perfil
            <ShareOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
          </Button>
        </Tooltip>
      </Stack>

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
