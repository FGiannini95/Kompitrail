import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

import { Typography, IconButton, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// Utils
import { getLocalStorage } from "../../../helpers/localStorageUtils";
import { getCurrentLang } from "../../../helpers/oneRouteUtils";
import { RoutesString } from "../../../routes/routes";
// Providers & Hooks
import { useConfirmationDialog } from "../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useSnackbar } from "../../../context/SnackbarContext/SnackbarContext";
import { useRoutes } from "../../../context/RoutesContext/RoutesContext";
import { KompitrailContext } from "../../../context/KompitrailContext";
// Components
import { RouteCard } from "./RouteCard/RouteCard";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { RouteEditDialog } from "./RouteEditDialog/RouteEditDialog";
import { Loading } from "../../../components/Loading/Loading";
import { OutlinedButton } from "../../../components/Buttons/OutlinedButton/OutlinedButton";
import { RouteCreateDialog } from "./RouteCreateDialog/RouteCreateDialog";

export const MyRoute = () => {
  const navigate = useNavigate();
  const tokenLocalStorage = getLocalStorage("token");
  const { openDialog } = useConfirmationDialog();
  const { showSnackbar } = useSnackbar();
  const {
    deleteRoute,
    loadUserRoutes,
    userRoutes,
    openDialog: openCreateEditDialog,
    loading,
  } = useRoutes();
  const { user } = useContext(KompitrailContext);
  const { t, i18n } = useTranslation(["buttons", "general", "dialogs"]);
  const currentLang = getCurrentLang(i18n);

  useEffect(() => {
    // Initial load when component mounts
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    loadUserRoutes(user_id);

    // Start polling every 15s while on MyRoute page
    const interval = setInterval(() => {
      loadUserRoutes(user_id);
    }, 15000);

    // Stop polling when leaving MyRoute
    return () => clearInterval(interval);
  }, [tokenLocalStorage, loadUserRoutes, currentLang]);

  const openCreateDialog = () => {
    openCreateEditDialog({ mode: "create" });
  };

  const handleDeleteRoute = (route_id) => {
    deleteRoute(route_id, user.user_id)
      .then(() => {
        showSnackbar(t("snackbars:routeDeleteSuccess"));
      })
      .catch((err) => {
        console.log(err);
        const msg =
          err?.response?.data?.message || t("snackbars:routeDeleteError");
        showSnackbar(msg, "error");
      });
  };

  const handleOpenDeleteDialog = (route_id) => {
    openDialog({
      title: t("dialogs:routeDeleteTitle"),
      message: t("dialogs:routeDeleteText"),
      onConfirm: () => handleDeleteRoute(route_id),
    });
  };

  const openEditDialog = (route_id) => {
    openCreateEditDialog({ mode: "edit", route_id });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center">
        <IconButton onClick={() => navigate(RoutesString.infouser)}>
          <ArrowBackIosIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          {t("general:routesTitle")}
        </Typography>
      </Grid>
      <Box sx={{ maxWidth: 480, mx: "auto", width: "100%", px: 2, mb: 2 }}>
        {userRoutes.length > 0 ? (
          userRoutes.map((route) => (
            <Grid
              key={route?.route_id}
              container
              justifyContent="center"
              mb={2}
            >
              <RouteCard
                route={route}
                onEdit={openEditDialog}
                onDelete={handleOpenDeleteDialog}
                isOwner={route.user_id === user.user_id}
              />
            </Grid>
          ))
        ) : (
          <Grid container justifyContent="center" mb={2}>
            <EmptyState />
          </Grid>
        )}
        <OutlinedButton
          onClick={openCreateDialog}
          text={t("buttons:createRoute")}
          icon={
            <AddOutlinedIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
        />
      </Box>
      <RouteEditDialog />
      <RouteCreateDialog />
    </Grid>
  );
};
