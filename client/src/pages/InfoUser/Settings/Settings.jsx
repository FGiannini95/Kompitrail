import React, { useContext, useState } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// MUI-ICONS
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { RoutesString } from "../../../routes/routes";
import {
  getLocalStorage,
  delLocalStorage,
} from "../../../helpers/localStorageUtils";

const gridStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const Settings = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const tokenLocalStorage = getLocalStorage("token");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmation = () => {
    deleteUser();
    logOut();
    setOpenDialog(false);
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

  const logOut = () => {
    delLocalStorage("token");
    setUser();
    setToken();
    setIsLogged(false);
    navigate(RoutesString.landing);
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/* Header */}
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon sx={{ color: "black" }} />
          <Typography variant="h6" sx={{ color: "black" }}>
            Ajustes
          </Typography>
        </IconButton>
      </Grid>

      {/* Settings Card */}
      <Grid
        sx={{
          marginTop: 2,
          marginLeft: 2,
          padding: 2,
          paddingLeft: 3,
          backgroundColor: "#eeeeee",
          borderRadius: 2,
          width: "calc(100% - 22px)",
        }}
      >
        {/* Change Password Option */}
        <Grid
          container
          spacing={3}
          onClick={() => navigate(RoutesString.editPassword)}
        >
          <Grid item xs={2} container spacing={0} sx={gridStyles}>
            <LockOutlinedIcon fontSize="large" />
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ margin: 1 }}>Modificar contraseña</Typography>
          </Grid>
          <Grid item xs={2} container spacing={0} sx={gridStyles}>
            <ArrowForwardIosIcon sx={{ color: "black" }} />
          </Grid>
        </Grid>

        {/* Delete Account Option */}
        <Grid container spacing={3} onClick={handleOpenDialog}>
          <Grid item xs={2} container spacing={0} sx={gridStyles}>
            <DeleteOutlineIcon fontSize="large" sx={{ color: "red" }} />
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ margin: 1, color: "red" }}>
              Eliminar cuenta
            </Typography>
          </Grid>
          <Grid item xs={2} container spacing={0} sx={gridStyles}>
            <ArrowForwardIosIcon sx={{ color: "red" }} />
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <Typography>
            Esta acción es irreversible. ¿Estás seguro de querer eliminar tu
            cuenta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirmation} color="success">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
