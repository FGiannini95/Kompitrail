import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  InputAdornment,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
// Components
import { CreateRouteCostumeTextfield } from "../../../../components/CreateRouteCostumeTextfield/CreateRouteCostumeTextfield";
// Utils
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
// Providers
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";

const initialValue = {
  route_name: "",
  starting_point: "",
  ending_point: "",
  level: "",
  distance: "",
  is_verified: false,
  suitable_motorbike_type: "",
  estimated_time: "",
  participants: "",
  route_description: "",
};

export const RouteEditDialog = () => {
  const [editRoute, setEditRoute] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const { showSnackbar } = useSnackbar();
  const { editRoute: updateRoute, dialog, closeDialog } = useRoutes();

  const isOpen = dialog.isOpen && dialog.mode === "edit";
  const route_id = dialog.selectedId;

  useEffect(() => {
    if (isOpen && route_id) {
      axios
        .get(`${ROUTES_URL}/oneroute/${route_id}`)
        .then((res) => {
          setEditRoute(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isOpen, route_id]);

  const handleClearField = (name) => {
    setEditRoute((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRoute((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // We need this to avoid HTML default behavior. The letter "e" is used for scientific notation, such as 1e5 (equivalent to 100000).
  const preventInvalidkey = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault(); // Block these buttons
    }
  };

  const cleanDialog = () => {
    closeDialog();
    setEditRoute(initialValue);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (editRoute.route_name === "") {
      newErrors.route_name = "Tienes que definir un nombre para la ruta";
    }
    if (editRoute.starting_point === "") {
      newErrors.starting_point = "Tienes que establecer un punto de salida";
    }
    if (editRoute.ending_point === "") {
      newErrors.ending_point = "Tienes que establecer un punto de llegada";
    }
    //Default value
    if (!editRoute.date) {
      editRoute.date = new Date().toISOString().slice(0, 19).replace("T", " "); // Fecha actual
    }
    if (!editRoute.distance) {
      newErrors.distance = "Debes especificar la distancia en km";
    }
    if (!editRoute.level) {
      newErrors.level = "Debes selecionar el nivel requerido";
    }
    if (!editRoute.estimated_time) {
      newErrors.estimated_time = "Debes establecer una duración";
    }
    if (!editRoute.participants) {
      newErrors.participants = "Debes definir el nº máximo de pilótos";
    }

    if (!editRoute.suitable_motorbike_type) {
      newErrors.suitable_motorbike_type =
        "Debes definir las motos aptas para las rutas";
    }
    if (editRoute.route_description === "") {
      newErrors.route_description =
        "Tienes que escribir una descripción más detallada";
    }

    setErrors(newErrors);

    // Si hay errores, detener la ejecución
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newFormData = new FormData();
    newFormData.append("editRoute", JSON.stringify(editRoute));

    axios
      .put(`${ROUTES_URL}/editroute/${route_id}`, newFormData)
      .then(() => axios.get(`${ROUTES_URL}/oneroute/${route_id}`))
      .then(({ data }) => {
        const update = Array.isArray(data) ? data[0] : data;
        updateRoute(update);
        showSnackbar("Ruta actualizada con éxito");
        closeDialog();
        setErrors({});
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al actualizar la ruta", "error");
      });
  };

  return (
    <Dialog open={isOpen} onClose={cleanDialog} fullWidth maxWidth="md">
      <DialogTitle>Editar ruta</DialogTitle>
      <DialogContent>
        <Box
          style={{
            backgroundColor: "#fafafa",
            paddingTop: "25px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CreateRouteCostumeTextfield
                label="Nombre ruta"
                name="route_name"
                value={editRoute?.route_name || ""}
                onChange={handleChange}
                onClear={() => handleClearField("route_name")}
                error={!!errors.route_name}
                helperText={errors.route_name}
              />
            </Grid>
            <Grid item xs={12}>
              <CreateRouteCostumeTextfield
                label="Salida"
                name="starting_point"
                value={editRoute?.starting_point || ""}
                onChange={handleChange}
                onClear={() => handleClearField("starting_point")}
                error={!!errors.starting_point}
                helperText={errors.starting_point}
              />
            </Grid>
            <Grid item xs={12}>
              <CreateRouteCostumeTextfield
                label="Llegada"
                name="ending_point"
                value={editRoute?.ending_point || ""}
                onChange={handleChange}
                onClear={() => handleClearField("ending_point")}
                error={!!errors.ending_point}
                helperText={errors.ending_point}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Km"
                name="distance"
                type="number"
                value={editRoute?.distance || ""}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: editRoute?.distance ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        onClick={() => handleClearField("distance")}
                        sx={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
                error={!!errors.distance}
                helperText={errors.distance}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración"
                name="estimated_time"
                type="number"
                value={editRoute?.estimated_time || ""}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: editRoute?.estimated_time ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        onClick={() => handleClearField("estimated_time")}
                        sx={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
                error={!!errors.estimated_time}
                helperText={errors.estimated_time}
              />
            </Grid>
            {/* <Grid item xs={7}>
              <Autocomplete
                disablePortal
                options={editRoute?.level || []}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setEditRoute((prevState) => ({
                    ...prevState,
                    level: value ? value.name : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nivel"
                    name="level"
                    // Avoid typing in the TextField
                    InputProps={{
                      ...params.InputProps,
                      inputProps: {
                        ...params.inputProps,
                        readOnly: true,
                      },
                    }}
                    onKeyDown={preventInvalidkey}
                    error={!!errors.level}
                    helperText={errors.level}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={5}>
              <TextField
                label="Pilotos"
                name="participants"
                type="number"
                fullWidth
                value={editRoute?.participants || ""}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: editRoute?.participants ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        onClick={() => handleClearField("participants")}
                        sx={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
                error={!!errors.participants}
                helperText={errors.participants}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Autocomplete
                clearOnEscape
                disablePortal
                options={editRoute?.motorbikeType || ""}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setEditRoute((prevState) => ({
                    ...prevState,
                    suitable_motorbike_type: value ? value.name : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Motos aptas"
                    name="suitable_motorbike_type"
                    // Avoid typing in the TextField
                    InputProps={{
                      ...params.InputProps,
                      inputProps: {
                        ...params.inputProps,
                        readOnly: true,
                      },
                    }}
                    error={!!errors.suitable_motorbike_type}
                    helperText={errors.suitable_motorbike_type}
                  />
                )}
              />
            </Grid> */}
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
                checked={!!editRoute?.is_verified}
                onChange={(event) =>
                  setEditRoute((prevState) => ({
                    ...prevState,
                    is_verified: event.target.checked,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="route_description"
                fullWidth
                multiline
                minRows={6}
                value={editRoute?.route_description || ""}
                InputProps={{
                  inputComponent: TextareaAutosize,
                }}
                onChange={handleChange}
                error={!!errors.route_description}
                helperText={errors.route_description}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanDialog} color="error">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
