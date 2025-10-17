import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Components
import { FormTextfield } from "../../../../components/FormTextfield/FormTextfield";
import { FormAutocomplete } from "../../../../components/FormAutocomplete/FormAutocomplete";
import { FormDataPicker } from "../../../../components/FormDataPicker/FormDataPicker";
// Utils
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
import { validateRouteForm } from "../../../../helpers/validateRouteForm";
import { toMySQLDateTime } from "../../../../helpers/utils";
// Providers
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
// Constants
import {
  MOTORBIKE_TYPES,
  ROUTE_INITIAL_VALUE,
  ROUTE_LEVELS,
} from "../../../../constants/routeConstants";

export const RouteEditDialog = () => {
  const [editRoute, setEditRoute] = useState(ROUTE_INITIAL_VALUE);
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

  const cleanDialog = () => {
    closeDialog();
    setEditRoute(ROUTE_INITIAL_VALUE);
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const newErrors = validateRouteForm(editRoute);
    setErrors(newErrors);

    // Si hay errores, detener la ejecución
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newFormData = new FormData();
    newFormData.append(
      "editRoute",
      JSON.stringify({
        ...editRoute,
        date: toMySQLDateTime(editRoute.date, "Europe/Madrid"),
      })
    );

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
            <Grid size={12}>
              <FormTextfield
                label="Salida"
                name="starting_point"
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormTextfield
                label="Llegada"
                name="ending_point"
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormDataPicker
                label="Fecha"
                name="date"
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormTextfield
                label="Km"
                name="distance"
                type="number"
                preventInvalidkey
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormTextfield
                label="Duración"
                name="estimated_time"
                type="number"
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={6}>
              <FormAutocomplete
                form={editRoute}
                setForm={setEditRoute}
                errors={errors}
                setErrors={setErrors}
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
                name="max_participants"
                type="number"
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={12}>
              <FormAutocomplete
                form={editRoute}
                setForm={setEditRoute}
                errors={errors}
                setErrors={setErrors}
                name="suitable_motorbike_type"
                label="Motos aptas"
                options={MOTORBIKE_TYPES}
                optionLabelKey="name"
                optionValueKey="name"
                multiple
                disablePortal
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
                checked={editRoute?.is_verified === 1}
                onChange={(event) =>
                  setEditRoute((prevState) => ({
                    ...prevState,
                    is_verified: event.target.checked ? 1 : 0,
                  }))
                }
              />
            </Grid>
            <Grid size={12}>
              <FormTextfield
                label="Descripción"
                name="route_description"
                multiline
                maxLength={250}
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
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
