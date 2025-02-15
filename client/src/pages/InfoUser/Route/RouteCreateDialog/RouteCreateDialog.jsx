import React, { useContext, useState } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { TextareaAutosize } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";

import axios from "axios";
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../../routes/routes";
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { CreateRouteCostumeTextfield } from "../../../../components/CreateRouteCostumeTextfield/CreateRouteCostumeTextfield";

const initialValue = {
  route_name: "",
  starting_point: "",
  ending_point: "",
  date: "",
  level: "",
  distance: "",
  is_verified: false,
  suitable_motorbike_type: "",
  estimated_time: "",
  participants: "",
  route_description: "",
  user_id: "",
};

export const RouteCreateDialog = ({ openCreateDialog, handleCloseDialog }) => {
  const [createOneRoute, setCreateOneRoute] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const { user } = useContext(KompitrailContext);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOneRoute((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClearField = (name) => {
    setCreateOneRoute((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const cleanDialog = () => {
    handleCloseDialog();
    setCreateOneRoute(initialValue);
    setErrors("");
  };

  // We need this to avoid HTML default behavior. The letter "e" is used for scientific notation, such as 1e5 (equivalent to 100000).
  const preventInvalidkey = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault(); // Block these buttons
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (createOneRoute.route_name === "") {
      newErrors.route_name = "Tienes que definir un nombre para la ruta";
    }
    if (createOneRoute.starting_point === "") {
      newErrors.starting_point = "Tienes que establecer un punto de salida";
    }
    if (createOneRoute.ending_point === "") {
      newErrors.ending_point = "Tienes que establecer un punto de llegada";
    }
    //Default value
    if (!createOneRoute.date) {
      createOneRoute.date = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Fecha actual
    }
    if (!createOneRoute.distance) {
      newErrors.distance = "Debes especificar la distancia en km";
    }
    if (!createOneRoute.level) {
      newErrors.level = "Debes selecionar el nivel requerido";
    }
    if (!createOneRoute.estimated_time) {
      newErrors.estimated_time = "Debes establecer una duración";
    }
    if (!createOneRoute.participants) {
      newErrors.participants = "Debes definir el nº máximo de pilótos";
    }

    if (!createOneRoute.suitable_motorbike_type) {
      newErrors.suitable_motorbike_type =
        "Debes definir las motos aptas para las rutas";
    }
    if (createOneRoute.route_description === "") {
      newErrors.route_description =
        "Tienes que escribir una descripción más detallada";
    }

    setErrors(newErrors);

    // Si hay errores, detener la ejecución
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newFormData = new FormData();
    newFormData.append(
      "createRoute",
      JSON.stringify({
        route_name: createOneRoute.route_name,
        starting_point: createOneRoute.starting_point,
        ending_point: createOneRoute.ending_point,
        date: createOneRoute.date,
        level: createOneRoute.level,
        distance: createOneRoute.distance,
        is_verified: createOneRoute.is_verified || false,
        suitable_motorbike_type: createOneRoute.suitable_motorbike_type,
        estimated_time: createOneRoute.estimated_time,
        participants: createOneRoute.participants,
        route_description: createOneRoute.route_description,
        user_id: user.user_id,
      })
    );

    axios
      .post(`${ROUTES_URL}/createroute`, newFormData)
      .then((res) => {
        setCreateOneRoute(res.data);
        navigate(RoutesString.route);
      })
      .catch((err) => {
        console.log(err);
      });
    cleanDialog();
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
              <CreateRouteCostumeTextfield
                label="Nombre ruta"
                name="route_name"
                value={createOneRoute.route_name}
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
                value={createOneRoute.starting_point}
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
                value={createOneRoute.ending_point}
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
                value={createOneRoute?.distance}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: createOneRoute?.distance ? (
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
                value={createOneRoute?.estimated_time}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: createOneRoute?.estimated_time ? (
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
            <Grid item xs={7}>
              <Autocomplete
                disablePortal
                options={level}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setCreateOneRoute((prevState) => ({
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
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Pilotos"
                name="participants"
                type="number"
                fullWidth
                value={createOneRoute?.participants}
                onChange={handleChange}
                onKeyDown={preventInvalidkey}
                // Add the close icon
                InputProps={{
                  endAdornment: createOneRoute?.participants ? (
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
            <Grid item xs={12}>
              <Autocomplete
                clearOnEscape
                disablePortal
                options={motorbikeType}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setCreateOneRoute((prevState) => ({
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
                checked={createOneRoute?.is_verified}
                onChange={(event) =>
                  setCreateOneRoute((prevState) => ({
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
                value={createOneRoute.route_description}
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
