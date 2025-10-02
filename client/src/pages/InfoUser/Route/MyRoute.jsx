import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  Typography,
  Grid2 as Grid,
  Button,
  IconButton,
  Box,
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// Components
import { RouteCard } from "./RouteCard/RouteCard";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { RouteEditDialog } from "./RouteEditDialog/RouteEditDialog";
// Utils
import { RoutesString } from "../../../routes/routes";
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { ROUTES_URL } from "../../../../../server/config/serverConfig";
// Providers
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../context/RoutesContext/RoutesContext";

export const MyRoute = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();
  const { deleteRoute, loadUserRoutes, userRoutes } = useRoutes();

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

  const handleOpenEditDialog = (route_id) => {
    setSelectedRouteId(route_id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
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
      />
    </Grid>
  );
};
