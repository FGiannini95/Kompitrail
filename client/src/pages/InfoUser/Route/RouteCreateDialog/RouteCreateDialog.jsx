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

import axios from "axios";
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../../routes/routes";
import { KompitrailContext } from "../../../../context/KompitrailContext";

const initialValue = {
  route_name: "",
  starting_point: "",
  ending_point: "",
  date: "",
  level: "",
  distance: "",
  is_verified: "",
  suitable_motorbike_type: "",
  estimated_time: "",
  participants: "",
  route_description: "",
  user_id: "",
};

export const RouteCreateDialog = ({ openCreateDialog, handleCloseDialog }) => {
  const [createOneRoute, setCreateOneRoute] = useState(initialValue);
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

  const cleanDialog = () => {
    handleCloseDialog();
    setCreateOneRoute(initialValue);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

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
        is_verified: createOneRoute.is_verified,
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
        console.log(res.data);
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
              <TextField
                label="Nombre ruta"
                name="route_name"
                fullWidth
                value={createOneRoute.route_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Salida"
                name="starting_point"
                value={createOneRoute.starting_point}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="LLegada"
                name="ending_point"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            {/* Move the onChange outside and verify that the type="numebr" displays the up and down arrows, change the name description to the correct one */}
            <Grid item xs={6}>
              <TextField
                label="Km"
                name="distance"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duración"
                name="estimated_time"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={level}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nivel"
                    name="level"
                    onChange={handleChange}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Pilotos"
                name="participants"
                type="number"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={motorbikeType}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Motos aptas"
                    name="suitable_motorbike_type"
                    onChange={handleChange}
                  />
                )}
              />
            </Grid>
            {/* <Grid
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
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="route_description"
                fullWidth
                multiline
                minRows={6}
                InputProps={{
                  inputComponent: TextareaAutosize,
                }}
                onChange={handleChange}
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
