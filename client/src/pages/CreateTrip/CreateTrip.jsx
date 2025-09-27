import React, { useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

// MUI-ICONS
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { RouteCreateDialog } from "../InfoUser/Route/RouteCreateDialog/RouteCreateDialog";

export const CreateTrip = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [openEditDialog, setOpenEditDialog] = useState(false);
  // const [allRoutes, setAllRoutes] = useState([]);
  // const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);
  // const [refresh, setRefresh] = useState(false);
  // const [showSnackbar, setShowSnackbar] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    //setOpenDeleteDialog(false);
    //setOpenEditDialog(false);
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
            onClick={handleOpenCreateDialog}
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
      <RouteCreateDialog
        openCreateDialog={openCreateDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </Grid>
  );
};
