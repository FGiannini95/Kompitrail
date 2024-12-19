import React from "react";

//MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

//MUI-ICONS
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useNavigate } from "react-router-dom";

//TODO: @julia El input de nombre y apellido tiene que tener el mismo tamaño con en las demás vistas (creo que le sobra un container), el código de teléfono tiene que tener todas las opciones, a ver si existe una manera para hacerlo), hay que usar axios para traer los datos del usuario, que rellenen los campo, refactorizar el código como en infouser(gridStyles). El button guardar se habilita sólo si cambia algún valor si vuelvo atrás reseteos los campos con el valor inicial. El button guardar ejecuta una sql de tipo update

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
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={1}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            marginTop: 2,
            width: 1 / 3,
            border: "1px solid black",
            borderRadius: "50%",
            aspectRatio: 1 / 1,
            backgroundColor: "green",
          }}
        >
          <Typography sx={{}} variant="h4">
            Pic here
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Nombre" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Apellidos" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            {/* Select para el código de país */}
            <Grid item xs={4} sm={3}>
              <TextField
                select
                label="Código"
                variant="outlined"
                fullWidth
                defaultValue="+34" // Valor inicial
              >
                {/* Opciones del desplegable */}
                {["+34", "+1", "+44", "+49"].map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* TextField para el número */}
            <Grid item xs={8} sm={9}>
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                type="tel"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
