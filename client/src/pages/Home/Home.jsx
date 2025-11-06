import React, { useContext, useEffect } from "react";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Providers & Hooks
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";
// Components
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Loading } from "../../components/Loading/Loading";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";
import { UserRoutesCarousel } from "../InfoUser/Route/UserRoutesCarousel/UserRoutesCarousel";
import { OutlinedButton } from "../../components/Buttons/OutlinedButton/OutlinedButton";
import { RouteCreateDialog } from "../InfoUser/Route/RouteCreateDialog/RouteCreateDialog";

export const Home = () => {
  const {
    loadAllRoutes,
    allRoutes,
    loading,
    openDialog: openCreateEditDialog,
  } = useRoutes();
  const { user } = useContext(KompitrailContext);

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

  const openCreateDialog = () => {
    openCreateEditDialog({ mode: "create" });
  };

  if (loading) {
    return <Loading />;
  }

  const futureRoutes = allRoutes.filter(
    (route) => new Date(route.date) >= new Date()
  );

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
      {futureRoutes.length > 0 && (
        <UserRoutesCarousel
          allRoutes={futureRoutes}
          title={"Tus próximas rutas"}
          showOnlyFuture={true}
          sortOrder="asc"
        />
      )}
      <OutlinedButton
        onClick={openCreateDialog}
        text={"Crear ruta"}
        icon={
          <AddOutlinedIcon
            style={{ paddingLeft: "5px", width: "20px" }}
            aria-hidden
          />
        }
      />
      <Grid sx={{ pt: 2 }}>
        <Typography>Rutas disponibles</Typography>
      </Grid>
      {futureRoutes.length > 0 ? (
        futureRoutes
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((route) => {
            return (
              <Grid
                key={route.route_id}
                container
                justifyContent="center"
                mb={2}
              >
                <RouteCard
                  {...route}
                  isOwner={route.user_id === user.user_id}
                />
              </Grid>
            );
          })
      ) : (
        <Grid container justifyContent="center" mb={2}>
          <EmptyState />
        </Grid>
      )}
      <RouteEditDialog />
      <RouteCreateDialog />
    </Box>
  );
};
