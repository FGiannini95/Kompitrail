import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
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
      <Grid>
        <Typography>Tus próximas rutas</Typography>
        {/* onClick sulla card deve aprire RouteCard a piena pagina con tutte le informazioni */}
        <Card
          sx={{
            width: "100%",
            bgcolor: "#eeeeee",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            sx={{ ".MuiCardHeader-content": { minWidth: 0 } }}
            title={
              <Typography
                sx={{
                  fontWeight: "bold",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  textAlign: "center",
                }}
              >
                {"Nome"}
              </Typography>
            }
          />
          <CardContent>
            <Typography>{"Partenza e arrivo"}</Typography>
            <Typography>{"Data"}</Typography>
            <Grid display="flex" gap={1}>
              <Badge
                overlap="circular"
                badgeContent="x"
                color="error"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                // Style the dot a bit bigger and add a white ring
                sx={{
                  "& .MuiBadge-badge": {
                    width: 16,
                    height: 16,
                    minWidth: 16,
                    borderRadius: "50%",
                  },
                }}
              >
                <Avatar />
              </Badge>
              <Avatar />
              <Avatar />
              <Avatar />
              <Avatar />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Typography>button per creare una ruta</Typography>
      <Button
        type="button"
        variant="contained"
        sx={{
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
      <Typography>
        Questo è solo per fare un pó di spazio con la sezione di sotto
      </Typography>
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
      <RouteEditDialog />
    </Box>
  );
};
