import React, { useState } from "react";

import { Typography, Grid2 as Grid, Button } from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { RouteCreateDialog } from "../InfoUser/Route/RouteCreateDialog/RouteCreateDialog";
import { useRoutes } from "../../context/RoutesContext/RoutesContext";

export const CreateTrip = () => {
  const { openCreateEditDialog } = useRoutes();

  const openCreateDialog = () => {
    openCreateEditDialog({ mode: "create" });
  };

  return (
    <Grid>
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
        <Typography>Personaliza tu ruta: </Typography>
        <ol>
          <li>Define tu punto de salida y de llegada</li>
          <li>Selecciona el nivel de dificultad</li>
          <li>Añade una descripción única.</li>
          <li>
            ¡Hazla más especial indicando el tipo de moto adecuado y el número
            de participantes!
          </li>
          <li>
            ¿Primera vez o ya conocida? Marca si tu ruta está verificada y
            establece el tiempo estimado para completarla.
          </li>
          <li>¡Empieza a planificar tu próxima aventura ahora!</li>
        </ol>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={openCreateDialog}
            sx={{
              color: "black",
              borderColor: "#eeeeee",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#dddddd",
                borderWidth: "1px",
              },
            }}
          >
            Crear ruta
            <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
          </Button>
        </Grid>
      </Grid>
      <RouteCreateDialog />
    </Grid>
  );
};
