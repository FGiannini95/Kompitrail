import React, { useContext, useState } from "react";

// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// MUI-ICONS
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

// TODO: Change to a real pdf now it is just random stuff
const url =
  "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf";

import { PrivacyDialog } from "./HelpAndSupport/Privacy/PrivacyDialog";
import { delLocalStorage } from "../../helpers/localStorageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../context/KompitrailContext";
import { capitalizeFullName, getInitials } from "../../helpers/utils";

const gridStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const InfoUser = () => {
  const { user, setUser, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [openIframe, setOpenIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const initials = getInitials(user.name, user.lastname);

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmation = () => {
    logOut();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    navigate(RoutesString.home);
  };

  const handleOpenIframe = (url) => {
    setIframeUrl(url);
    setOpenIframe(true);
  };

  const handleCloseIframe = () => {
    setOpenIframe(false);
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
            item
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
          <Grid item xs={12}>
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
          {/* Empieza Modificar perfil */}
          <Grid
            container
            spacing={3}
            onClick={() => navigate(RoutesString.editUser)}
          >
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <PersonOutlineOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
                Modificar perfil
              </Typography>
            </Grid>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <ArrowForwardIosIcon style={{ color: "black" }} />
            </Grid>
          </Grid>
          {/* Empieza Mis motos */}
          <Grid
            container
            spacing={3}
            onClick={() => navigate(RoutesString.motorbike)}
          >
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <TwoWheelerOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Mis motos</Typography>
            </Grid>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <ArrowForwardIosIcon style={{ color: "black" }} />
            </Grid>
          </Grid>
          {/* Empieza Mis rutas */}
          <Grid
            container
            spacing={3}
            onClick={() => navigate(RoutesString.route)}
          >
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <RouteOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Mis rutas</Typography>
            </Grid>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          {/* Empieza Ajustes */}
          <Grid
            container
            spacing={3}
            onClick={() => navigate(RoutesString.settings)}
          >
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <SettingsOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Ajustes</Typography>
            </Grid>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <IconButton>
                <ArrowForwardIosIcon style={{ color: "black" }} />
              </IconButton>{" "}
            </Grid>
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
          Ayuda y soporte
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <TextsmsOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Chat bot</Typography>
            </Grid>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3} onClick={() => handleOpenIframe(url)}>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <InfoOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
                Política de privacidad
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon style={{ color: "black" }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Empieza Log out */}
      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
        onClick={() => handleOpenDialog("logout")}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Desconectar perfil
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid item xs={2} container spacing={0} sx={gridStyles}>
              <LogoutIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Log Out</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cerrar sesión</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de querer cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmation} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <PrivacyDialog
        openIframe={openIframe}
        handleCloseIframe={handleCloseIframe}
        iframeUrl={iframeUrl}
      />
    </Box>
  );
};
