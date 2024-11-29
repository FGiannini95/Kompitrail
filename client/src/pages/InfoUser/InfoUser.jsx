import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { KompitrailContext } from "../../../context/KompitrailContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  delLocalStorage,
  getLocalStorage,
} from "../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { RoutesString } from "../../routes/routes";

// Icono para que los navigates funcionen
import IconButton from "@mui/material/IconButton";
// Iconos
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export const InfoUser = () => {
  const { user, setUser, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const tokenLocalStorage = getLocalStorage("token");

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
    navigate(RoutesString.landing);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType("");
  };

  const deleteUser = () => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .put(`http://localhost:3000/users/deleteuser/${user_id}`)
      .then((res) => {
        console.log(res.data);
        navigate(RoutesString.landing);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmation = () => {
    if (dialogType === "logout") {
      logOut();
    } else if (dialogType === "delete") {
      deleteUser();
      logOut();
    }
    setOpenDialog(false);
  };

  const handleCancel = () => {
    navigate(-1);
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
              border: "1px solid black",
              borderRadius: "50%",
              aspectRatio: 1 / 1,
            }}
            style={{ paddingTop: "0px", paddingLeft: "0px" }}
          >
            <Typography sx={{}} variant="h4">
              {iniciales}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {user.name} {user.lastname}
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
              Compartir perfil
              <ShareOutlinedIcon
                style={{ paddingLeft: "5px", width: "20px" }}
              />
            </Button>
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
          <Grid container spacing={3}>
            {/* Epieza Modificar perfil */}
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <PersonOutlineOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
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
              <IconButton onClick={() => navigate(RoutesString.editUser)}>
                <ArrowForwardIosIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>
          </Grid>
          {/* Empieza Mis motos */}
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
              <TwoWheelerOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Mis motos</Typography>
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
              <IconButton onClick={() => navigate(RoutesString.motorbike)}>
                <ArrowForwardIosIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>
          </Grid>
          {/* Empieza Mis rutas */}
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
              <RouteOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Mis rutas</Typography>
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
          {/* Empieza Ajustes */}
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
              <SettingsOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>Ajustes</Typography>
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
              <Typography style={{ margin: "10px" }}>Chat bot</Typography>
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
              <ArrowForwardIosIcon />
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
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
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
      {/* EMpieza Eliminar perfil */}
      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
        onClick={() => handleOpenDialog("delete")}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Eliminar perfil
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
              <DeleteOutlineIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
                Eliminar cuenta
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
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === "logout" ? "Cerrar sesión" : "Eliminar perfil"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {dialogType === "logout"
              ? "¿Estás seguro de querer cerrar sesión?"
              : "Esta acción es irreversible. ¿Estás seguro de querer eliminar tu cuenta?"}
          </Typography>
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
    </Box>
  );
};
