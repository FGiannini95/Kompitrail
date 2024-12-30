import React from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

// MUI-ICONS
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const CreateTrip = () => {
  return (
    <>
      <Typography>
        Personaliza tu ruta: define tu punto de salida y llegada, selecciona el
        nivel de dificultad, y añade una descripción única. ¡Hazla más especial
        indicando el tipo de moto adecuado y el número de participantes!
        ¿Primera vez o ya conocida? Marca si tu ruta está verificada y establece
        el tiempo estimado para completarla.
      </Typography>
      <Typography>¡Empieza a planificar tu próxima aventura ahora!</Typography>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            //onClick={handleOpenCreate}
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
    </>
  );
};
