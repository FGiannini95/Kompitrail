import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Utils
import { ROUTES_URL } from "../../../../api";
import { validateRouteForm } from "../../../../helpers/validateRouteForm";
import { toMySQLDateTime } from "../../../../helpers/utils";
// Providers & Hooks
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
// Constants
import {
  MOTORBIKE_TYPES,
  PARTICIPANTS,
  ROUTE_INITIAL_VALUE,
  ROUTE_LEVELS,
} from "../../../../constants/routeConstants";
// Components
import { FormTextfield } from "../../../../components/FormTextfield/FormTextfield";
import { FormAutocomplete } from "../../../../components/FormAutocomplete/FormAutocomplete";
import { FormDataPicker } from "../../../../components/FormDataPicker/FormDataPicker";

export const RouteEditDialog = () => {
  const [editRoute, setEditRoute] = useState(ROUTE_INITIAL_VALUE);
  const [errors, setErrors] = useState({});

  const { showSnackbar } = useSnackbar();
  const { editRoute: updateRoute, dialog, closeDialog } = useRoutes();

  const isOpen = dialog.isOpen && dialog.mode === "edit";
  const route_id = dialog.selectedId;
  const { t, i18n } = useTranslation(["dialogs", "forms", "snackbars"]);

  // Number of already enrolled users in this route
  const occupiedSeats = Array.isArray(editRoute?.max_participants)
    ? editRoute.max_participants.length
    : 0;

  // Available options for max_participants, cannot be less than occupiedSeats
  const maxParticipantsOptions = PARTICIPANTS.filter((opt) => {
    return opt.id >= occupiedSeats;
  });

  useEffect(() => {
    if (isOpen && route_id) {
      const currentLang = i18n.language?.slice(0, 2) || "es";

      axios
        .get(`${ROUTES_URL}/oneroute/${route_id}?lang=${currentLang}`)
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

    // Extra validation to ensure max_participants is not lower than occupied seats
    const currentMaxParticipants = Number(editRoute?.max_participants) || 0;

    if (occupiedSeats > 0 && currentMaxParticipants < occupiedSeats) {
      // We prevent lowering the capacity under the number of already enrolled users
      newErrors.max_participants = t("errors:route.maxParticipantsTooLow", {
        occupiedSeats,
      });
    }

    setErrors(newErrors);

    // Si hay errores, detener la ejecución
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Get current language from i18next and normalize to "es" | "en" | "it"
    const currentLang = i18n.language?.slice(0, 2) || "es";

    const newFormData = new FormData();
    newFormData.append(
      "editRoute",
      JSON.stringify({
        ...editRoute,
        date: toMySQLDateTime(editRoute.date, "Europe/Madrid"),
        language: currentLang,
      })
    );

    axios
      .put(`${ROUTES_URL}/editroute/${route_id}`, newFormData)
      .then(() => axios.get(`${ROUTES_URL}/oneroute/${route_id}`))
      .then(({ data }) => {
        const update = Array.isArray(data) ? data[0] : data;
        updateRoute(update);
        showSnackbar(t("snackbars:routeUpdatedSuccess"));
        closeDialog();
        setErrors({});
      })
      .catch((err) => {
        console.log(err);
        showSnackbar(t("snackbars:routeUpdatedError"), "error");
      });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={cleanDialog}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: (theme) => ({
          bgcolor: theme.palette.kompitrail.card,
          color: theme.palette.text.primary,
          borderRadius: 2,
        }),
      }}
    >
      <DialogTitle>{t("dialogs:routeEditTitle")}</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormTextfield
              label={t("forms:startingPointLabel")}
              name="starting_point"
              errors={errors}
              setErrors={setErrors}
              form={editRoute}
              setForm={setEditRoute}
            />
          </Grid>
          <Grid size={12}>
            <FormTextfield
              label={t("forms:endingPointLabel")}
              name="ending_point"
              errors={errors}
              setErrors={setErrors}
              form={editRoute}
              setForm={setEditRoute}
            />
          </Grid>
          <Grid size={12}>
            <FormDataPicker
              label={t("forms:dateLabel")}
              name="date"
              errors={errors}
              setErrors={setErrors}
              form={editRoute}
              setForm={setEditRoute}
            />
          </Grid>
          <Grid size={6}>
            <FormTextfield
              label={t("forms:kmLabel")}
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
              label={t("forms:estimatedTimeLable")}
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
              name="level"
              label={t("forms:levelLabel")}
              errors={errors}
              setErrors={setErrors}
              form={editRoute}
              setForm={setEditRoute}
              options={ROUTE_LEVELS}
              optionLabelKey="name"
              optionValueKey="name"
              getOptionLabel={(opt) => t(`forms:level.${opt.name}`)}
              disablePortal
            />
          </Grid>
          <Grid size={6}>
            <FormAutocomplete
              name="max_participants"
              label={t("forms:maxParticipantsLabel")}
              errors={errors}
              setErrors={setErrors}
              form={editRoute}
              setForm={setEditRoute}
              options={maxParticipantsOptions}
              optionLabelKey="name"
              optionValueKey="id"
              disablePortal
            />
          </Grid>
          <Grid size={12}>
            <FormAutocomplete
              form={editRoute}
              setForm={setEditRoute}
              errors={errors}
              setErrors={setErrors}
              name="suitable_motorbike_type"
              label={t("forms:motorbikeTypeLabel")}
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
            <Typography>{t("forms:checkbox")}</Typography>
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
          <Grid size={12} sx={{ mb: 2 }}>
            <FormTextfield
              label={t("forms:descriptionLabel")}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanDialog} color="error">
          {t("buttons:cancel")}
        </Button>
        <Button onClick={handleConfirm} color="success">
          {t("buttons:confirmar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
