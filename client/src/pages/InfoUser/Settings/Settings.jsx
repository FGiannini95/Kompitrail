import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const navigate = useNavigate();
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
      </Grid>
      <Grid
        style={{
          marginTop: "30px",
          padding: "10px",
          paddingLeft: "20px",
          backgroundColor: "#eeeeee",
          margin: "10px",
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ paddingBottom: "10px" }}
        >
          Ajustes
        </Typography>
        <Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <LockOutlinedIcon fontSize="large" />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }}>
                Modificar contraseña
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <DeleteOutlineIcon fontSize="large" sx={{ color: "red" }} />
            </Grid>
            <Grid item xs={8}>
              <Typography style={{ margin: "10px" }} color="red">
                Eliminar cuenta
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowForwardIosIcon sx={{ color: "red" }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
