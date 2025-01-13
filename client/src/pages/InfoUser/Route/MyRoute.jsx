import React from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";

export const MyRoute = () => {
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
    </Grid>
  );
};
