import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Components
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Loading } from "../../components/Loading/Loading";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";

// Utils
import { ROUTES_URL } from "../../../../server/config/serverConfig";
import { RoutesString } from "../../routes/routes";
// Providers
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";

export const Home = () => {
  const [joiningRouteId, setJoiningRouteId] = useState(null);

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
  const navigate = useNavigate();

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
      message: "¿Quieres eliminar la ruta de la plataforma?",
      onConfirm: () => handleDeleteRoute(route_id),
    });
  };

  const openEditDialog = (route_id) => {
    openCreateEditDialog({ mode: "edit", route_id });
  };

  const handleJoinRoute = (route_id) => {
    if (joiningRouteId) return;
    setJoiningRouteId(route_id);
    axios
      .post(`${ROUTES_URL}/join/${route_id}`, { user_id: user.user_id })
      .then(() => {
        loadAllRoutes();
        showSnackbar("Inscripción completada");
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al inscribirte", "error");
      })
      .finally(() => {
        setJoiningRouteId(null);
      });
  };

  const handleLeaveRoute = (route_id) => {
    // axios
    //   .delete(`${ROUTES_URL}/leave/${route_id}`, {
    //     data: { user_id: user.user_id },
    //   })
    //   .then(() => {
    //     loadAllRoutes();
    //     showSnackbar("Inscripción cancelada");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     showSnackbar("Error durante la cancelación", "error");
    //   });
  };

  const handleOpenLeaveRoute = (route_id) => {
    openDialog({
      title: "Cancelar inscripción",
      message: "¿Quieres cancelar la inscripción a esta ruta?",
      onConfirm: () => handleLeaveRoute(route_id),
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
      <Grid>
        <Typography>Tus próximas rutas</Typography>
      </Grid>
      <Button
        type="button"
        variant="contained"
        sx={{
          mb: 2,
          color: "black",
          boxShadow: "none",
          backgroundColor: "#eeeeee",
          "&:hover": { backgroundColor: "#dddddd" },
        }}
        fullWidth
        onClick={() => navigate(RoutesString.createTrip)}
      >
        Crear ruta
        <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
      </Button>
      {allRoutes.length > 0 ? (
        allRoutes.map((route) => (
          <Grid key={route?.route_id} container justifyContent="center" mb={2}>
            <RouteCard
              {...route}
              onEdit={openEditDialog}
              onDelete={handleOpenDeleteDialog}
              onJoinRoute={handleJoinRoute}
              onLeaveRoute={handleOpenLeaveRoute}
              isOwner={route.user_id === user.user_id}
              isJoining={joiningRouteId === route.route_id}
            />
          </Grid>
        ))
      ) : (
        <Grid container justifyContent="center" mb={2}>
          <EmptyState />
        </Grid>
      )}
      <RouteEditDialog />
    </Box>
  );
};
