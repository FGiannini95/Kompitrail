import React, { useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";
import { RouteCard } from "./RouteCard/RouteCard";

export const MyRoute = () => {
  const [allRoutes, setAllRoutes] = useState([]);
  const navigate = useNavigate();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(RoutesString.infouser)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      {/* Map allRoute and display in a card, divide between active and old ones */}
      <Grid item container direction="column" spacing={2}>
        {allRoutes.map((route) => {
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
              {/* We have to pass down all the props */}
              <RouteCard />
            </Grid>
          </Grid>;
        })}
      </Grid>
    </Grid>
  );
};
