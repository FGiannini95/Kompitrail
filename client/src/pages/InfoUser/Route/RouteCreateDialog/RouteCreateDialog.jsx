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

// MUI-ICONS
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export const RouteCreateDialog = ({ openCreateDialog, handleCloseDialog }) => {
  const [createOneRoute, setCreateOneRoute] = useState();

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
            <Grid item xs={6}>
              <TextField label="Km" name="email" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Duración" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Nivel" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} label="Pilotos" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={[]}
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
