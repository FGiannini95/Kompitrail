import React, { useContext, useEffect } from "react";
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
import { RoutesString } from "../../routes/routes";
// Providers
import { useRoutes } from "../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../context/KompitrailContext";

export const Home = () => {
  const { loadAllRoutes, allRoutes, loading } = useRoutes();
  const { user } = useContext(KompitrailContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllRoutes();
  }, [loadAllRoutes]);

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
            <RouteCard {...route} isOwner={route.user_id === user.user_id} />
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
