import axios from "axios";
import React, { useState, useEffect } from "react";

// MUI
import Grid from "@mui/material/Grid2";

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
    <Grid container spacing={2}>
      {allRoutes.length > 0 ? (
        allRoutes.map((route) => (
          <Grid
            key={route?.routes_id}
            container
            spacing={1}
            sx={{
              marginTop: "10px",
              marginLeft: "45px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Grid item xs={12}>
              {/* We pass down all the props */}
              <RouteCard {...route} />
            </Grid>
          </Grid>
        ))
      ) : (
        <Grid
          container
          spacing={1}
          sx={{
            marginTop: "10px",
            marginLeft: "75px",
            textAlign: "center",
          }}
        >
          <EmptyState />
        </Grid>
      )}
    </Grid>
  );
};
