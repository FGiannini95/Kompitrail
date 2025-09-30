import React, { useEffect, useState } from "react";

import {
  Typography,
  Grid2 as Grid,
  Button,
  IconButton,
  Box,
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";
import { RouteCard } from "./RouteCard/RouteCard";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import { ROUTES_URL } from "../../../../../server/config/serverConfig";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { SnackbarMessage } from "../../../components/SnackbarMessage/SnackbarMessage";
import { RouteEditDialog } from "./RouteEditDialog/RouteEditDialog";
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";

export const MyRoute = () => {
  const [allRoutesOneUser, setAllRoutesOneUser] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .get(`${ROUTES_URL}/showallroutesoneuser/${user_id}`)
      .then((res) => {
        setAllRoutesOneUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const handleOpenCreateRoute = () => {
    navigate(RoutesString.createTrip);
  };

  const handleDeleteRoute = (route_id) => {
    axios
      .put(`${ROUTES_URL}/deleteroute/${route_id}`)
      // Display result + navigation
      .then(() => {
        //showSnackbar("Ruta eliminada con éxito");
        //triggerRefresh();
        setTimeout(() => {
          navigate(-1);
        }, 2000)
          // Errors
          .catch((err) => {
            console.log(err);
            //showSnackbar("Error al eliminar la ruta", error);
          });
      });
  };

  const handleOpenDeleteDialog = (route_id) => {
    openDialog({
      title: "Eliminar ruta",
      message: "¿Quieres eliminar la ruta de tu perfil?",
      onConfirm: () => handleDeleteRoute(route_id),
    });
  };

  const handleOpenEditDialog = (route_id) => {
    setSelectedRouteId(route_id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
  };

  const handleOpenSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
        {allRoutesOneUser.length > 0 ? (
          allRoutesOneUser.map((route) => (
            <Grid
              key={route?.route_id}
              container
              justifyContent="center"
              mb={2}
            >
              <RouteCard
                {...route}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
              />
            </Grid>
          ))
        ) : (
          <Grid container justifyContent="center" mb={2}>
            <EmptyState />
          </Grid>
        )}
      </Box>
      <Grid>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleOpenCreateRoute}
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "1px",
            },
          }}
        >
          Crar Ruta
          <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
        </Button>
      </Grid>
      <RouteEditDialog
        openEditDialog={openEditDialog}
        handleCloseDialog={handleCloseDialog}
        route_id={selectedRouteId}
        setRefresh={setRefresh}
        handleOpenSnackbar={handleOpenSnackbar}
      />

      <SnackbarMessage
        open={showSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleCloseSnackbar}
      />
    </Grid>
  );
};
