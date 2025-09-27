import React, { useState, useEffect } from "react";
import axios from "axios";

// MUI
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import { ROUTES_URL } from "../../../../server/config/serverConfig";
import { RouteCard } from "../InfoUser/Route/RouteCard/RouteCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";

export const Home = () => {
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    axios
      .get(`${ROUTES_URL}/showallroutes`)
      .then((res) => {
        setAllRoutes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 8 }}>
      {allRoutes.length > 0 ? (
        allRoutes.map((route) => (
          <Grid key={route?.routes_id} container justifyContent="center" mb={2}>
            <RouteCard {...route} />
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
