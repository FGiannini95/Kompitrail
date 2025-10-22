import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { Typography, Button, IconButton, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// Utils
import { RoutesString } from "../../../routes/routes";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { ROUTES_URL } from "../../../../../server/config/serverConfig";
// Providers
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../../context/KompitrailContext";
// Components
import { RouteCard } from "./RouteCard/RouteCard";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { RouteEditDialog } from "./RouteEditDialog/RouteEditDialog";
import { Loading } from "../../../components/Loading/Loading";
import { OutlinedButton } from "../../../components/Buttons/OutlinedButton/OutlinedButton";

export const MyRoute = () => {
  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();
  const {
    deleteRoute,
    loadUserRoutes,
    userRoutes,
    openDialog: openCreateEditDialog,
    loading,
  } = useRoutes();
  const { user } = useContext(KompitrailContext);

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    loadUserRoutes(user_id);
  }, [tokenLocalStorage, loadUserRoutes]);

  const handleOpenCreateRoute = () => {
    navigate(RoutesString.createTrip);
  };

  const handleDeleteRoute = (route_id) => {
    axios
      .put(`${ROUTES_URL}/deleteroute/${route_id}`)
      .then(() => {
        deleteRoute(route_id);
        showSnackbar("Ruta eliminada con éxito");
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al eliminar la ruta", "error");
      });
  };

  const handleOpenDeleteDialog = (route_id) => {
    openDialog({
      title: "Eliminar ruta",
      message: "¿Quieres eliminar la ruta de tu perfil?",
      onConfirm: () => handleDeleteRoute(route_id),
    });
  };

  const openEditDialog = (route_id) => {
    openCreateEditDialog({ mode: "edit", route_id });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      <Box sx={{ maxWidth: 480, mx: "auto", px: 2, minWidth: 310 }}>
        {userRoutes.length > 0 ? (
          userRoutes.map((route) => (
            <Grid
              key={route?.route_id}
              container
              justifyContent="center"
              mb={2}
            >
              <RouteCard
                {...route}
                onEdit={openEditDialog}
                onDelete={handleOpenDeleteDialog}
                isOwner={route.user_id === user.user_id}
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
        <OutlinedButton
          onClick={handleOpenCreateRoute}
          text={"Crear ruta"}
          icon={
            <AddOutlinedIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
        />
      </Grid>
      <RouteEditDialog />
    </Grid>
  );
};
