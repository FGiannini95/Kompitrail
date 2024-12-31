import React, { useState } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import {
  TextareaAutosize,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

//principiante', 'medio', 'avanzado', 'experto'
// ('Trail ', 'maxitrail', 'Minitrail', 'enduro', 'Supermoto', 'motocross', 'dual sport', 'cross country', 'adventure touring')

export const RouteCreateDialog = ({ openCreateDialog, handleCloseDialog }) => {
  const [createOneRoute, setCreateOneRoute] = useState();

  const level = [
    { id: 1, name: "Principiante" },
    { id: 2, name: "Medio" },
    { id: 3, name: "Avanzado" },
    { id: 4, name: "Experto" },
  ];

  const motorbikeType = [
    { id: 1, name: "Trail" },
    { id: 2, name: "Maxitrail" },
    { id: 3, name: "Enduro" },
    { id: 4, name: "Supermoto" },
    { id: 5, name: "Motocross" },
    { id: 6, name: "Dual sport" },
    { id: 7, name: "Cross country" },
    { id: 8, name: "Adventure" },
  ];

  const cleanDialog = () => {
    handleCloseDialog();
    setCreateOneRoute("");
  };

  return (
    <Dialog
      open={openCreateDialog}
      onClose={cleanDialog}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Añadir ruta</DialogTitle>

      <DialogContent>
        <Box
          style={{
            backgroundColor: "#fafafa",
            paddingTop: "25px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nombre ruta" name="email" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Salida" name="email" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="LLegada" name="email" fullWidth />
            </Grid>
            {/* Move the onChange outside and verify that the type="numebr" displays the up and down arrows, change the name description to the correct one */}
            <Grid item xs={6}>
              <TextField
                label="Km"
                name="km"
                type="number"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;
                  console.log("Valor ingresado en KM:", value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración"
                name="duración"
                type="number"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;
                  console.log("valor ingresado en duración:", value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={level}
                getOptionLabel={(option) => option.name}
                S
                renderInput={(params) => (
                  <TextField {...params} label="Nivel" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Pilotos"
                name="pilotos"
                type="number"
                fullWidth
                onChange={(event) => {
                  const value = event.target.value;
                  console.log("Valor ingresado en pilotos:", value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={motorbikeType}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Motos aptas" />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>¿Primera vez en esta ruta?</Typography>
              <Checkbox
                inputProps={{ "aria-label": "controlled" }}
                color="default"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="description"
                fullWidth
                multiline
                minRows={6}
                InputProps={{
                  inputComponent: TextareaAutosize,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanDialog} color="error">
          Cancelar
        </Button>
        <Button color="success">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};
