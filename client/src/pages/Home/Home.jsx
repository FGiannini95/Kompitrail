import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Box, Grid2 as Grid } from "@mui/material";

import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
// Utils
import { ROUTES_URL } from "../../../../server/config/serverConfig";
// Providers
import { useConfirmationDialog } from "../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../context/SnackbarContext/SnackbarContext";

export const Home = () => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const navigate = useNavigate();
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get(`${ROUTES_URL}/showallroutes`)
      .then((res) => setAllRoutes(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDeleteRoute = (route_id) => {
    axios
      .put(`${ROUTES_URL}/deleteroute/${route_id}`)
      .then(() => {
        setRefresh((prev) => !prev);
        showSnackbar("Ruta eliminada con éxito");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
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
  const handleOpenEditDialog = (route_id) => {
    setSelectedRouteId(route_id);
    setOpenEditDialog(true);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
      {allRoutes.length > 0 ? (
        allRoutes.map((route) => (
          <Grid key={route?.route_id} container justifyContent="center" mb={2}>
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
  );
};
