import React, { useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import ChatIcon from "@mui/icons-material/Chat";
// Utils
import {
  capitalizeFirstLetter,
  formatDateTime,
} from "../../../../helpers/utils";
import { ROUTES_URL } from "../../../../../../server/config/serverConfig";
import { RoutesString } from "../../../../routes/routes";
// Providers
import { useConfirmationDialog } from "../../../../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
import { useSnackbar } from "../../../../context/SnackbarContext/SnackbarContext";
import { KompitrailContext } from "../../../../context/KompitrailContext";

const InfoItem = ({ label, value }) => (
  <Grid xs={6}>
    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Grid>
);

export const OneRoute = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id: route_id } = useParams();
  const { openDialog } = useConfirmationDialog();
  const { deleteRoute, closeDialog } = useRoutes();
  const { showSnackbar } = useSnackbar();
  const { user: currentUser } = useContext(KompitrailContext);

  const {
    date,
    level,
    distance,
    suitable_motorbike_type,
    estimated_time,
    max_participants,
    is_verified,
    route_description,
    participants = [],
    isOwner,
    handleJoin,
    handleLeave,
  } = state || {};

  const { date_dd_mm_yyyy, time_hh_mm, weekday } = formatDateTime(date);
  const weekdayCap = capitalizeFirstLetter(weekday);

  const isCurrentUserEnrolled = useMemo(() => {
    return participants.some((p) => p.user_id === currentUser?.user_id);
  }, [participants, currentUser?.user_id]);

  const currentParticipants = 1 + participants.length;
  const isRouteFull = currentParticipants >= max_participants;

  const handleDelete = () => {
    return deleteRoute(route_id)
      .then(() => {
        showSnackbar("Ruta eliminada con éxito");
        closeDialog();
        navigate(RoutesString.home);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error al eliminar la ruta", "error");
      });
  };

  const handleOpenDeleteDialog = () => {
    openDialog({
      title: "Eliminar ruta",
      message: "¿Quieres eliminar la ruta de la plataforma?",
      onConfirm: () => handleDelete(),
    });
  };

  const buttonConfig = useMemo(() => {
    if (isOwner) {
      return {
        text: "Eliminar ruta",
        onClick: () => handleOpenDeleteDialog?.(route_id),
        danger: true,
        disabled: false,
        show: true,
      };
    }

    if (isCurrentUserEnrolled) {
      return {
        text: "Cancelar Inscripción",
        onClick: handleLeave,
        danger: true,
        disabled: false,
        show: true,
      };
    }

    if (!isRouteFull && !isOwner && !isCurrentUserEnrolled) {
      return {
        text: "Únete",
        onClick: handleJoin,
        danger: false,
        disabled: false,
        show: true,
      };
    }

    if (isRouteFull && !isOwner && !isCurrentUserEnrolled) {
      return {
        text: "Ruta completa",
        danger: false,
        disabled: true,
        show: true,
      };
    }
  }, [isOwner, isCurrentUserEnrolled, isRouteFull]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <IconButton>
          <ShareOutlinedIcon style={{ color: "black" }} />
        </IconButton>
      </Grid>
      <Card
        sx={{
          width: "95%",
          ml: "10px",
          bgcolor: "#eeeeee",
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <TimelineOutlinedIcon fontSize="medium" aria-hidden />
            <InfoItem
              value={`${weekdayCap} ${date_dd_mm_yyyy} - ${time_hh_mm}`}
            />
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <InfoItem label="Distancia" value={`${distance} km`} />
            <InfoItem label="Duración" value={`${estimated_time} h`} />
            <InfoItem label="Nivel" value={level} />
          </Grid>
        </CardContent>
      </Card>
      <Stack sx={{ pl: 2 }}>
        <Typography
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          {is_verified === 0 ? (
            <VerifiedOutlinedIcon fontSize="medium" aria-hidden />
          ) : (
            <NewReleasesOutlinedIcon fontSize="medium" aria-hidden />
          )}
          {is_verified === 0
            ? "Ruta conocida — ya probada"
            : "Ruta nueva — a la aventura"}
        </Typography>
      </Stack>

      <Card
        sx={{
          width: "95%",
          ml: "10px",
          bgcolor: "#eeeeee",
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Typography>Todos los avatar</Typography>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ p: "10px" }}
      >
        <Button
          type="button"
          variant="contained"
          sx={{
            color: "black",
            boxShadow: "none",
            backgroundColor: "#eeeeee",
            "&:hover": { backgroundColor: "#dddddd" },
          }}
          fullWidth
        >
          Calendario
          <CalendarMonthIcon
            style={{ paddingLeft: "5px", width: "20px" }}
            aria-hidden
          />
        </Button>

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "2px",
            },
          }}
        >
          Chat
          <ChatIcon style={{ paddingLeft: "5px", width: "20px" }} aria-hidden />
        </Button>
      </Stack>
      <Card
        sx={{
          width: "95%",
          ml: "10px",
          bgcolor: "#eeeeee",
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Typography>Aqui va en enlace para maps</Typography>
        </CardContent>
      </Card>

      <Stack sx={{ pl: 2 }}>
        <Typography sx={{ fontWeight: "bold" }}>Información general</Typography>
        <Stack direction="row" spacing={0.75}>
          <Groups2OutlinedIcon fontSize="medium" aria-hidden />
          <Typography>{`Max. ${max_participants} pilotos`} </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <TwoWheelerOutlinedIcon fontSize="medium" aria-hidden />
          <Typography>{`Motos aptas: ${suitable_motorbike_type}`} </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <DescriptionOutlinedIcon fontSize="medium" aria-hidden />
          <Typography>{route_description} </Typography>
        </Stack>
      </Stack>

      {buttonConfig.show && (
        <Grid>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            disabled={buttonConfig.disabled}
            onClick={buttonConfig.disabled ? undefined : buttonConfig.onClick}
            sx={{
              color: buttonConfig.danger ? "error.main" : "black",
              borderColor: buttonConfig.danger ? "error.main" : "#eeeeee",
              borderWidth: buttonConfig.danger ? "1px" : "2px",
            }}
          >
            {buttonConfig.text}{" "}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
