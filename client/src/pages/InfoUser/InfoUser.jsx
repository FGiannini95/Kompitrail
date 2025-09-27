import React, { useContext, useState } from "react";

import {
  Box,
  Grid2 as Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  List,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const url =
  "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf";

import { delLocalStorage } from "../../helpers/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../context/KompitrailContext";
import { capitalizeFullName, getInitials } from "../../helpers/utils";
import { SettingsRow } from "./Settings/SettingsRow/SettingsRow";
import { PrivacyDialog } from "./Privacy/PrivacyDialog";

export const InfoUser = () => {
  const { user, setUser, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const [dialog, setDialog] = useState(false);
  const [iframe, setiIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();
  const initials = getInitials(user.name, user.lastname);

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  const handleToggleDialog = () => {
    setDialog(!dialog);
  };

  const handleConfirmation = () => {
    logOut();
    setDialog(false);
  };

  const handleCancel = () => {
    navigate("/");
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
      style={{
        backgroundColor: "#fafafa",
        paddingTop: "25px",
      }}
    >
      <Grid>
        <CloseOutlinedIcon
          style={{ paddingLeft: "20px" }}
          onClick={handleCancel}
        />
      </Grid>
      <Grid>
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            xs={1}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 1 / 3,
              border: "2px solid black",
              borderRadius: "50%",
              aspectRatio: 1 / 1,
            }}
            style={{ paddingTop: "0px", paddingLeft: "0px" }}
          >
            <Typography sx={{}} variant="h4">
              {initials}
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {capitalizeFullName(user.name, user.lastname)}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}
          style={{
            paddingTop: "25px",
            paddingLeft: "20px",
            marginBottom: "30px",
          }}
        >
          <Grid style={{ paddingRight: "10px" }}>
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
          </Grid>
          <Grid>
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
                <ShareOutlinedIcon
                  style={{ paddingLeft: "5px", width: "20px" }}
                />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Mi cuenta
        </Typography>
        <Grid>
          <List disablePadding>
            {/* Edit profil option */}
            <SettingsRow
              action="editAccount"
              onClick={() => navigate(RoutesString.editUser)}
            />
            {/* Add motorbike option */}
            <SettingsRow
              action="addMotorbike"
              onClick={() => navigate(RoutesString.motorbike)}
            />
            {/* Add route option */}
            <SettingsRow
              action="addRoute"
              onClick={() => navigate(RoutesString.route)}
            />
            {/* Settings option */}
            <SettingsRow
              action="changeSettings"
              onClick={() => navigate(RoutesString.settings)}
            />
          </List>
        </Grid>
      </Grid>
      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Ayuda y soporte
        </Typography>
        <List>
          {/* Chatbot option */}
          <SettingsRow
            action="chatbot"
            onClick={() => navigate(RoutesString.settings)}
          />
          {/* Privacy option */}
          <SettingsRow
            action="privacy"
            onClick={() => handleToggleIframe(url)}
          />
        </List>
      </Grid>
      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Desconectar perfil
        </Typography>
        <List>
          {/* Logout */}
          <SettingsRow
            action="logout"
            onClick={() => handleToggleDialog("logout")}
          />
        </List>
      </Grid>
      <Dialog open={dialog} onClose={handleToggleDialog}>
        <DialogTitle>Cerrar sesión</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de querer cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmation} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <PrivacyDialog
        openIframe={iframe}
        handleCloseIframe={handleToggleIframe}
        iframeUrl={iframeUrl}
      />
    </Box>
  );
};
