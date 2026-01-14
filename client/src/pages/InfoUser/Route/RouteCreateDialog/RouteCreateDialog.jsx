import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Checkbox,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
  ButtonBase,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";

// Utils
import { ROUTES_URL } from "../../../../api";
import { RoutesString } from "../../../../routes/routes";
import { validateRouteForm } from "../../../../helpers/validateRouteForm";
import { getCurrentLang } from "../../../../helpers/oneRouteUtils";
import { formatMinutesToHHMM } from "../../../../helpers/utils";
// Providers & Hooks
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
import { useRouteMetrics } from "../../../../hooks/useRouteMetrics";
import { useReverseGeocoding } from "../../../../hooks/useReverseGeocoding";
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
import { RouteMapDialog } from "../../../../components/Dialogs/RouteMapDialog/RouteMapDialog";

export const RouteCreateDialog = () => {
  const [createOneRoute, setCreateOneRoute] = useState(ROUTE_INITIAL_VALUE);
  const [errors, setErrors] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  // Which field is currently selecting a location on the map.
  const [mapTarget, setMapTarget] = useState(null);

  const { user } = useContext(KompitrailContext);
  const { showSnackbar } = useSnackbar();
  const { createRoute, dialog, closeDialog } = useRoutes();
  const { t, i18n } = useTranslation([
    "dialogs",
    "forms",
    "buttons",
    "snackbars",
  ]);
  const metricsEndpoint = `${ROUTES_URL}/metrics`;
  const isOpen = dialog.isOpen && dialog.mode === "create";
  const { reverseGeocode, currentLang } = useReverseGeocoding();
  const { data: metrics, loading: isRecalculating } = useRouteMetrics({
    start: createOneRoute.starting_point,
    end: createOneRoute.ending_point,
    endpointUrl: metricsEndpoint,
    enabled: isOpen,
    debounceMs: 600,
  });

  const navigate = useNavigate();
  const hasStart =
    createOneRoute?.starting_point?.lat != null &&
    createOneRoute?.starting_point?.lng != null;
  const hasEnd =
    createOneRoute?.ending_point?.lat != null &&
    createOneRoute?.ending_point?.lng != null;
  const hasMetrics =
    metrics?.distanceKm != null && metrics?.durationMinutes != null;
  const waypointCount = createOneRoute?.waypoints?.length || 0;

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

    const currentLang = getCurrentLang(i18n);

    const newFormData = new FormData();
    newFormData.append(
      "createRoute",
      JSON.stringify({
        starting_point: createOneRoute.starting_point.fullLabel,
        starting_point_short: createOneRoute.starting_point.shortLabel,
        starting_lat: createOneRoute.starting_point.lat,
        starting_lng: createOneRoute.starting_point.lng,
        ending_point: createOneRoute.ending_point.label,
        ending_point_short: createOneRoute.ending_point.shortLabel,
        ending_lat: createOneRoute.ending_point.lat,
        ending_lng: createOneRoute.ending_point.lng,
        date: createOneRoute.date,
        level: createOneRoute.level,
        is_verified: createOneRoute.is_verified,
        suitable_motorbike_type: createOneRoute.suitable_motorbike_type,
        max_participants: createOneRoute.max_participants,
        route_description: createOneRoute.route_description,
        user_id: user.user_id,
        language: currentLang,
      })
    );

    axios
      .post(`${ROUTES_URL}/createroute`, newFormData)
      .then(({ data }) => {
        createRoute(data);
        showSnackbar(t("snackbars:routeCreatedSuccess"));
        navigate(RoutesString.home);
        cleanDialog();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar(t("snackbars:routeCreatedError"), "error");
      });
  };

  useEffect(() => {
    if (!isOpen) return;
    if (hasStart) return;

    // Show the Placeholder immediately
    setCreateOneRoute((prev) => ({
      ...prev,
      starting_point: {
        ...prev.starting_point,
        label: "Posición actual",
      },
    }));

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // If coords are already set, don't overwrite and avoid double runs
        if (
          createOneRoute.starting_point?.lat != null &&
          createOneRoute.starting_point?.lng != null
        ) {
          return;
        }

        // Reverse geocode to get real full + short labels
        const { fullLabel, shortLabel } = await reverseGeocode({
          lat: latitude,
          lng: longitude,
          language: currentLang,
        });

        setCreateOneRoute((prev) => {
          // Double-check inside setState too
          if (
            prev.starting_point?.lat != null &&
            prev.starting_point?.lng != null
          ) {
            return prev;
          }

          return {
            ...prev,
            starting_point: {
              ...prev.starting_point,
              fullLabel,
              shortLabel,
              lat: latitude,
              lng: longitude,
            },
          };
        });
      },
      (error) => console.error("Geolocation error", error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000,
      }
    );
  }, [
    isOpen,
    hasStart,
    reverseGeocode,
    currentLang,
    createOneRoute.starting_point?.lat,
    createOneRoute.starting_point?.lng,
  ]);

  useEffect(() => {
    if (!metrics) return;

    setCreateOneRoute((prev) => ({
      ...prev,
      distance: metrics.distanceKm,
      estimated_time: metrics.durationMinutes,
    }));
  }, [metrics, setCreateOneRoute]);

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
        <DialogTitle>{t("dialogs:routeCreateTitle")}</DialogTitle>
        <DialogContent sx={{ overflow: "visible" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormTextfield
                label={t("forms:startingPointLabel")}
                name="starting_point.label"
                readOnly
                clearable={false}
                form={createOneRoute}
                setForm={setCreateOneRoute}
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
                name="ending_point.label"
                readOnly
                clearable={false}
                form={createOneRoute}
                setForm={setCreateOneRoute}
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
                form={createOneRoute}
                setForm={setCreateOneRoute}
              />
            </Grid>

            {hasStart && hasEnd && hasMetrics && (
              <>
                <Grid size={6}>
                  <FormTextfield
                    label={t("forms:kmLabel")}
                    name="distance"
                    type="number"
                    readOnly
                    clearable={false}
                    errors={errors}
                    setErrors={setErrors}
                    form={createOneRoute}
                    setForm={setCreateOneRoute}
                  />
                </Grid>
                <Grid size={6}>
                  <FormTextfield
                    label={t("forms:estimatedTimeLable")}
                    name="estimated_time"
                    type="text"
                    value={formatMinutesToHHMM(createOneRoute.estimated_time)}
                    readOnly
                    clearable={false}
                    errors={errors}
                    setErrors={setErrors}
                    form={createOneRoute}
                    setForm={setCreateOneRoute}
                  />
                </Grid>
              </>
            )}

            <Grid size={12}>
              <FormAutocomplete
                label={t("forms:levelLabel")}
                name="level"
                errors={errors}
                setErrors={setErrors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
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
                form={createOneRoute}
                setForm={setCreateOneRoute}
                options={PARTICIPANTS}
                optionLabelKey="name"
                optionValueKey="name"
                disablePortal
              />
            </Grid>

            <Grid size={12}>
              <FormAutocomplete
                label={t("forms:motorbikeTypeLabel")}
                name="suitable_motorbike_type"
                errors={errors}
                setErrors={setErrors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
                options={MOTORBIKE_TYPES}
                optionLabelKey="name"
                optionValueKey="name"
                multiple
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
              <Typography>{t("forms:checkbox")}</Typography>
              <Checkbox
                inputProps={{ "aria-label": "controlled" }}
                color="default"
                checked={createOneRoute?.is_verified === 1}
                onChange={(event) =>
                  setCreateOneRoute((prevState) => ({
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
                errors={errors}
                setErrors={setErrors}
                form={createOneRoute}
                setForm={setCreateOneRoute}
                multiline
                maxLength={250}
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
            ? createOneRoute?.starting_point
            : mapTarget === "end"
              ? createOneRoute?.ending_point
              : null
        }
        onCancel={() => {
          setIsMapOpen(false);
          setMapTarget(null);
        }}
        onConfirm={(point) => {
          setCreateOneRoute((prev) => {
            if (mapTarget === "start")
              return { ...prev, starting_point: point };
            if (mapTarget === "end") return { ...prev, ending_point: point };
            return prev;
          });

          setIsMapOpen(false);
          setMapTarget(null);
        }}
      />
    </>
  );
};
