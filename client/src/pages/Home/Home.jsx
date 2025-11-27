import React, { useContext, useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Providers & Hooks
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";
// Utils
import {
  getLocalStorage,
  saveLocalStorage,
} from "../../helpers/localStorageUtils";
// Components
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Loading } from "../../components/Loading/Loading";
import { RouteEditDialog } from "../InfoUser/Route/RouteEditDialog/RouteEditDialog";
import { UserRoutesCarousel } from "../InfoUser/Route/UserRoutesCarousel/UserRoutesCarousel";
import { OutlinedButton } from "../../components/Buttons/OutlinedButton/OutlinedButton";
import { RouteCreateDialog } from "../InfoUser/Route/RouteCreateDialog/RouteCreateDialog";

const LAST_ROUTES_VISIT_KEY = "kompitrail.routes.lastVisit";

export const Home = () => {
  const {
    loadAllRoutes,
    allRoutes,
    loading,
    openDialog: openCreateEditDialog,
  } = useRoutes();
  const { user } = useContext(KompitrailContext);
  const [lastRoutesVisit, setLastRoutesVisit] = useState(null);

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

  // Handle new routes
  useEffect(() => {
    // Read previous visit from storage
    const storedVisit = getLocalStorage(LAST_ROUTES_VISIT_KEY);

    // If there is a value convert it to Date and store it
    if (storedVisit) {
      const previousVisit = new Date(storedVisit);
      setLastRoutesVisit(previousVisit);
    } else {
      setLastRoutesVisit(null);
    }

    // Save the new value in the storage
    const newVisit = new Date().toISOString();
    saveLocalStorage(LAST_ROUTES_VISIT_KEY, newVisit);
  }, []);

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
                  lastRoutesVisit={lastRoutesVisit}
                  enableNewBadge={true}
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
