import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Checkbox,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Components
import { FormTextfield } from "../../../../components/FormTextfield/FormTextfield";
import { FormAutocomplete } from "../../../../components/FormAutocomplete/FormAutocomplete";
// Utils
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
import { RoutesString } from "../../../../routes/routes";
import { validateRouteForm } from "../../../../helpers/validateRouteForm";
// Providers
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
// Constants
import {
  MOTORBIKE_TYPES,
  ROUTE_INITIAL_VALUE,
  ROUTE_LEVELS,
} from "../../../../constants/routeConstants";

export const RouteCreateDialog = () => {
  const [createOneRoute, setCreateOneRoute] = useState(ROUTE_INITIAL_VALUE);
  const [errors, setErrors] = useState({});

  const { user } = useContext(KompitrailContext);
  const { showSnackbar } = useSnackbar();
  const { createRoute, dialog, closeDialog } = useRoutes();

  const navigate = useNavigate();
  const isOpen = dialog.isOpen && dialog.mode === "create";

  const cleanDialog = () => {
    closeDialog();
    setCreateOneRoute(ROUTE_INITIAL_VALUE);
    setErrors("");
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const newErrors = validateRouteForm(createOneRoute);
    setErrors(newErrors);

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
      .then(({ data }) => {
        createRoute(data);
        showSnackbar("Ruata añadida con éxito");
        navigate(RoutesString.route);
        cleanDialog();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al añadir la ruta", "error");
      });
  };

  return (
    <Dialog open={isOpen} onClose={cleanDialog} fullWidth maxWidth="md">
      <DialogTitle>Añadir ruta</DialogTitle>
      <DialogContent>
        <Box
          style={{
            backgroundColor: "#fafafa",
            paddingTop: "25px",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormTextfield
                label="Nombre ruta"
                name="route_name"
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormTextfield
                label="Salida"
                name="starting_point"
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormTextfield
                label="Llegada"
                name="ending_point"
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormTextfield
                label="Km"
                name="distance"
                type="number"
                preventInvalidkey
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormTextfield
                label="Duración"
                name="estimated_time"
                type="number"
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormAutocomplete
                form={createOneRoute}
                setForm={setCreateOneRoute}
                errors={errors}
                name="level"
                label="Nivel"
                options={ROUTE_LEVELS}
                optionLabelKey="name"
                optionValueKey="name"
                disablePortal
              />
            </Grid>
            <Grid size={6}>
              <FormTextfield
                label="Pilotos"
                name="participants"
                type="number"
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormAutocomplete
                form={createOneRoute}
                setForm={setCreateOneRoute}
                errors={errors}
                name="suitable_motorbike_type"
                label="Motos aptas"
                options={MOTORBIKE_TYPES}
                optionLabelKey="name"
                optionValueKey="name"
                multiple
                readOnly
                disablePortal
              />
            </Grid>
            <Grid
              size={12}
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
            <Grid size={12}>
              <FormTextfield
                label="Descripción"
                name="route_description"
                multiline
                minRows={6}
                errors={errors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
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
