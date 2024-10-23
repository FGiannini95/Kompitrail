import React, { useContext, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { KompitrailContext } from "../../../context/KompitrailContext";
// import axios from "axios";

// Importacion de iconos
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import WalletIcon from "@mui/icons-material/Wallet";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { delLocalStorage } from "../../helpers/localStorageUtils";

export const InfoUser = () => {
  const { user, token, setUser, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const navigate = useNavigate();

  const getInitials = (name, lastname) => {
    const firstLetterName = name?.charAt(0).toUpperCase() || "";
    const firstLetterLastName = lastname?.charAt(0).toUpperCase() || "";

    return `${firstLetterName}${firstLetterLastName}`;
  };

  const iniciales = getInitials(user.name, user.lastname);

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate("/");
  };

  return (
    <div style={{ paddingTop: "50px" }}>
      <Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user.name} {user.lastname}
            </Typography>
          </Grid>
          {/* <Grid
            item
            xs={3}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              border: "1px solid black",
              borderRadius: "50%",
              aspectRatio: 1 / 1,
            }}
            style={{ paddingTop: "0px", paddingLeft: "0px" }}
          >
            <Typography sx={{}} variant="h4">
              {iniciales}
            </Typography>
          </Grid> */}
        </Grid>
        <Grid
          container
          spacing={2}
          style={{ paddingTop: "25px", paddingLeft: "15px" }}
        >
          <Grid style={{ paddingRight: "10px" }}>
            <Button type="button" variant="contained" color="primary" fullWidth>
              Ir a premium
            </Button>
          </Grid>
          <Grid>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
            >
              {/* añadir icono de compartir */}
              Compartir prefil
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid style={{ paddingTop: "40px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mi cuenta
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <AccountCircleIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ fontWeight: "bold" }}>
                Modificar perfil
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
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <DirectionsBikeIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography>Mis motos</Typography>
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
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              {/* Añadir icono de rutas */}
              <WalletIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography>Mis rutas</Typography>
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
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <SettingsSharpIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography>Ajustes</Typography>
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
      <Grid style={{ paddingTop: "40px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Ayuda y soporte
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <TextsmsOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography>Chat bot</Typography>
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
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <InfoOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography>Plitica de privacidad</Typography>
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
      <Grid style={{ paddingTop: "40px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Desconectar perfil
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <LogoutIcon />
            </Grid>
            <Grid item xs={8}>
              <Typography>Log Out</Typography>
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
              <ArrowForwardIosIcon onClick={logOut} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
