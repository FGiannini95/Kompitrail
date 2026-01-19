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

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";

// Utils
import { ROUTES_URL } from "../../../../api";
import { validateRouteForm } from "../../../../helpers/validateRouteForm";
import {
  formatMinutesToHHMM,
  toMySQLDateTime,
} from "../../../../helpers/utils";
import { getCurrentLang } from "../../../../helpers/oneRouteUtils";
import { getPointLabel } from "../../../../helpers/pointMetrics";
// Providers & Hooks
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
import { useRouteMetrics } from "../../../../hooks/useRouteMetrics";
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
import { RouteMapDialog } from "../../../../components/Maps/RouteMapDialog/RouteMapDialog";

export const RouteEditDialog = () => {
  const [editRoute, setEditRoute] = useState(ROUTE_INITIAL_VALUE);
  const [errors, setErrors] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState(null); // "start" or "end"

  const metricsEndpoint = `${ROUTES_URL}/metrics`;

  const { showSnackbar } = useSnackbar();
  const { editRoute: updateRoute, dialog, closeDialog } = useRoutes();
  const { t, i18n } = useTranslation(["dialogs", "forms", "snackbars"]);

  const isOpen = dialog.isOpen && dialog.mode === "edit";
  const route_id = dialog.selectedId;
  const currentLang = getCurrentLang(i18n);

  // Total people already in the route: 1 creator + current participants
  const currentParticipants =
    1 +
    (Array.isArray(editRoute?.participants)
      ? editRoute.participants.length
      : 0);

  // Available options for max_participants, cannot be less than occupiedSeats
  const maxParticipantsOptions = PARTICIPANTS.filter((opt) => {
    return opt.id >= currentParticipants;
  });

  // Get labels for display
  const startingLabel = getPointLabel(
    {
      lat: editRoute.starting_lat,
      lng: editRoute.starting_lng,
      i18n: editRoute.starting_point_i18n,
    },
    currentLang,
    "full"
  );

  const endingLabel = getPointLabel(
    {
      lat: editRoute.ending_lat,
      lng: editRoute.ending_lng,
      i18n: editRoute.ending_point_i18n,
    },
    currentLang,
    "full"
  );

  const { data: routeMetrics } = useRouteMetrics({
    start: {
      lat: Number(editRoute.starting_lat),
      lng: Number(editRoute.starting_lng),
    },
    end: {
      lat: Number(editRoute.ending_lat),
      lng: Number(editRoute.ending_lng),
    },
    enabled: Boolean(
      editRoute.starting_lat &&
        editRoute.starting_lng &&
        editRoute.ending_lat &&
        editRoute.ending_lng
    ),
    debounceMs: 600,
    endpointUrl: metricsEndpoint,
  });

  useEffect(() => {
    if (routeMetrics) {
      setEditRoute((prev) => ({
        ...prev,
        distance: routeMetrics.distanceKm,
        estimated_time: routeMetrics.durationMinutes,
        route_geometry: routeMetrics.geometry,
      }));
    }
  }, [routeMetrics]);

  // Load route data when dialog opens
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
    setErrors({});
  };

  const handleConfirm = (e) => {
    e.preventDefault();

    const newErrors = validateRouteForm(editRoute);

    // Extra validation to ensure max_participants is not lower than occupied seats
    const currentMaxParticipants = Number(editRoute?.max_participants) || 0;

    if (
      currentParticipants > 0 &&
      currentMaxParticipants < currentParticipants
    ) {
      // We prevent lowering the capacity under the number of already enrolled users
      newErrors.max_participants = t("errors:route.maxParticipantsTooLow", {
        currentParticipants,
      });
    }

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
    <>
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
                value={startingLabel}
                readOnly
                clearable={false}
                errors={errors}
                setErrors={setErrors}
                endAdornment={<NearMeOutlinedIcon />}
                onClick={() => {
                  setMapTarget("start");
                  setIsMapOpen(true);
                }}
              />
            </Grid>
            <Grid size={12}>
              <FormTextfield
                label={t("forms:endingPointLabel")}
                name="ending_point"
                value={endingLabel}
                readOnly
                clearable={false}
                errors={errors}
                setErrors={setErrors}
                endAdornment={<LocationOnOutlinedIcon />}
                onClick={() => {
                  setMapTarget("end");
                  setIsMapOpen(true);
                }}
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
                readOnly
                clearable={false}
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
                type="text"
                readOnly
                clearable={false}
                value={formatMinutesToHHMM(editRoute.estimated_time)}
                errors={errors}
                setErrors={setErrors}
                form={editRoute}
                setForm={setEditRoute}
              />
            </Grid>
            <Grid size={12}>
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
            <Grid size={12}>
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
      <RouteMapDialog
        open={isMapOpen}
        initialSelected={
          mapTarget === "start"
            ? {
                lat: editRoute.starting_lat,
                lng: editRoute.starting_lng,
                i18n: editRoute.starting_point_i18n,
              }
            : mapTarget === "end"
              ? {
                  lat: editRoute.ending_lat,
                  lng: editRoute.ending_lng,
                  i18n: editRoute.ending_point_i18n,
                }
              : null
        }
        onCancel={() => {
          setIsMapOpen(false);
          setMapTarget(null);
        }}
        onConfirm={(point) => {
          setEditRoute((prev) => {
            if (mapTarget === "start") {
              return {
                ...prev,
                starting_lat: point.lat,
                starting_lng: point.lng,
                starting_point_i18n: point.i18n,
              };
            }
            if (mapTarget === "end") {
              return {
                ...prev,
                ending_lat: point.lat,
                ending_lng: point.lng,
                ending_point_i18n: point.i18n,
              };
            }
            return prev;
          });

          setIsMapOpen(false);
          setMapTarget(null);
        }}
      />
    </>
  );
};
