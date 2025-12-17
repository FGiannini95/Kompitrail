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
  const currentLang = i18n.language?.slice(0, 2) || "es";

  useEffect(() => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    loadUserRoutes(user_id, { language: currentLang });
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
        <IconButton onClick={() => navigate(-1)}>
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
      <Box sx={{ maxWidth: 480, mx: "auto", width: "100%", px: 2 }}>
        {userRoutes.length > 0 ? (
          userRoutes.map((route) => (
            <Grid
              key={route?.route_id}
              container
              justifyContent="center"
              mb={2}
            >
              <RouteCard
                {...route}
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
