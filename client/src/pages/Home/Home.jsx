import React, { useContext, useEffect } from "react";
import axios from "axios";

import { Box, Grid2 as Grid } from "@mui/material";
// Components
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Loading } from "../../components/Loading/Loading";
// Utils
import { ROUTES_URL } from "../../../../server/config/serverConfig";
// Providers
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";

export const Home = () => {
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();
  const {
    deleteRoute,
    loadAllRoutes,
    allRoutes,
    openDialog: openCreateEditDialog,
    loading,
  } = useRoutes();
  const { user } = useContext(KompitrailContext);

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

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
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
      {allRoutes.length > 0 ? (
        allRoutes.map((route) => (
          <Grid key={route?.route_id} container justifyContent="center" mb={2}>
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
  );
};
