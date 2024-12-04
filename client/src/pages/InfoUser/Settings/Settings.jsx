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
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
      </Grid>
      <Grid
        style={{
          marginTop: "30px",
          marginLeft: "20px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          borderRadius: "20px",
          // Need to use it in a temporary way to align eith the style
          width: "calc(100% - 22px)",
        }}
        onClick={() => handleOpenDialog()}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Ajustes
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
              <LockOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
                Modificar contraseña
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
              <DeleteOutlineIcon fontSize="large" sx={{ color: "red" }} />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }} color="red">
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
              <IconButton>
                <ArrowForwardIosIcon style={{ color: "red" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <Typography>
            Esta acción es irreversible. ¿Estás seguro de querer eliminar tu
            cuenta?
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
    </Grid>
  );
};
