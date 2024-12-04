import React from "react";

//MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

//MUI-ICONS
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";

export const EditUser = () => {
  const navigate = useNavigate();
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Modificar perfil</Typography>
        <Button variant="text" color="black" disabled>
          Guardar
        </Button>
      </Grid>
    </Grid>
  );
};
