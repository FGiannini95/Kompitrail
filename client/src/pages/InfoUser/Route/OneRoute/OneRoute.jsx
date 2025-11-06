import React, { useContext, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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
// Providers & Hooks
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useShareUrl } from "../../../../hooks/useShareUrl";
// Components
import { RouteParticipantsSection } from "../../../../components/RouteParticipantsSection/RouteParticipantsSection";
import { openCalendar } from "../../../../helpers/calendar";
import { OutlinedButton } from "../../../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../../../components/Buttons/ContainedButton/ContainedButton";
import { Header } from "../../../../components/Header/Header";

const InfoItem = ({ label, value }) => (
  <Grid xs={6}>
    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Grid>
);

export const OneRoute = () => {
  const { state } = useLocation();
  const { id: route_id } = useParams();
  const { user: currentUser } = useContext(KompitrailContext);
  const { isCopied, handleShare } = useShareUrl({
    mode: "route",
    routeId: route_id,
  });

  const participantsSectionRef = useRef();

  const {
    date,
    starting_point,
    ending_point,
    level,
    distance,
    suitable_motorbike_type,
    estimated_time,
    max_participants,
    is_verified,
    route_description,
    participants = [],
    isOwner,
    user_id,
    create_name,
    user_img,
  } = state || {};

  const { date_dd_mm_yyyy, time_hh_mm, weekday, isValid } =
    formatDateTime(date);
  const weekdayCap = isValid ? capitalizeFirstLetter(weekday) : "";

  const isCurrentUserEnrolled = useMemo(() => {
    return participants.some((p) => p.user_id === currentUser?.user_id);
  }, [participants, currentUser?.user_id]);

  const currentParticipants = 1 + participants.length;
  const isRouteFull = currentParticipants >= max_participants;

  const now = new Date();
  const routeDate = new Date(date);
  const isPastRoute = routeDate < now;

  const buttonConfig = useMemo(() => {
    if (isPastRoute) {
      return {
        text: "Ruta finalizada",
        onClick: undefined,
        danger: false,
        disabled: true,
        show: true,
      };
    }

    if (isOwner) {
      return {
        text: "Eliminar ruta",
        onClick: () => participantsSectionRef.current?.handleOpenDeleteDialog(),
        danger: true,
        disabled: false,
        show: true,
      };
    }

    if (isCurrentUserEnrolled) {
      return {
        text: "Cancelar Inscripción",
        onClick: () => participantsSectionRef.current?.handleOpenLeaveRoute(),
        danger: true,
        disabled: false,
        show: true,
      };
    }

    if (!isRouteFull && !isOwner && !isCurrentUserEnrolled) {
      return {
        text: "Únete",
        onClick: () => participantsSectionRef.current?.handleJoin(),
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
  }, [isOwner, isCurrentUserEnrolled, isRouteFull, isPastRoute]);

  const handleOpenCalendar = !isPastRoute
    ? () =>
        openCalendar({
          starting_point,
          ending_point,
          dateISO: date,
          estimated_time,
        })
    : undefined;

  return (
    <Grid container direction="column" spacing={2}>
      <Header onShare={handleShare} isCopied={isCopied} />
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
              value={
                isValid
                  ? `${weekdayCap} ${date_dd_mm_yyyy} - ${time_hh_mm}`
                  : "Fecha no disponible"
              }
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
          <RouteParticipantsSection
            ref={participantsSectionRef}
            route_id={route_id}
            user_id={user_id}
            create_name={create_name}
            user_img={user_img}
            participants={participants}
            max_participants={max_participants}
            isOwner={isOwner}
            isPastRoute={isPastRoute}
          />
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ p: "10px" }}
      >
        <ContainedButton
          onClick={handleOpenCalendar}
          text={"Calendario"}
          icon={
            <CalendarMonthIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
        />
        <OutlinedButton
          text={"Chat"}
          icon={
            <ChatIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
        />
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
            {buttonConfig.text}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
