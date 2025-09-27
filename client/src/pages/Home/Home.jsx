import React, { useState, useEffect } from "react";
import axios from "axios";

import { Box, Grid2 as Grid } from "@mui/material";

import { ROUTES_URL } from "../../../../server/config/serverConfig";
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";

export const Home = ({ handleOpenEditDialog, handleOpenDeleteDialog }) => {
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    axios
      .get(`${ROUTES_URL}/showallroutes`)
      .then((res) => setAllRoutes(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 8 }}>
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
