import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Tooltip,
  Box,
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
import { ROUTES_URL, USERS_URL } from "../../../../api";
// Providers & Hooks
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useShareUrl } from "../../../../hooks/useShareUrl";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
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
  const { state } = useLocation(); // May be undefined on deep link
  const { id: route_id } = useParams();
  const { user: currentUser } = useContext(KompitrailContext);
  const { isCopied, handleShare } = useShareUrl({
    mode: "route",
    routeId: route_id,
  });
  const { allRoutes, loadAllRoutes } = useRoutes();
  const navigate = useNavigate();

  const [fetched, setFetched] = useState(null);

  const participantsSectionRef = useRef();
  useEffect(() => {
    if (state) return; // Internal navigation already has data
    if (!route_id) return;

    let cancelled = false;

    (async () => {
      try {
        // Fetch the route
        const { data: routeRaw } = await axios.get(
          `${ROUTES_URL}/oneroute/${route_id}`
        );
        const route = routeRaw ?? {};

        // Base object
        const base = {
          ...route,
          participants: Array.isArray(route.participants)
            ? route.participants
            : [],
        };

        let create_name = base.create_name;
        let user_img = base.user_img;

        if ((!create_name || !user_img) && base.user_id) {
          try {
            const { data: userRaw } = await axios.get(
              `${USERS_URL}/oneuser/${base.user_id}`
            );
            const user = Array.isArray(userRaw)
              ? (userRaw[0] ?? {})
              : (userRaw ?? {});

            const firstName = (user?.name ?? "").trim();

            create_name = create_name ?? firstName;
            user_img = user_img ?? user?.img ?? null;
          } catch (e) {
            // Non-blocking: keep page working even if this fails
            console.log("Creator fetch failed (non-blocking)", e);
          }
        }

        if (!cancelled) {
          setFetched({ ...base, create_name, user_img });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Route fetch error:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state, route_id]);

  // Ensure the routes cache exists to use as a fallback source
  useEffect(() => {
    if (state) return; // internal navigation already has participants
    if (!fetched) return; // wait for the single-route fetch
    if (Array.isArray(fetched.participants) && fetched.participants.length > 0)
      return;

    // If cache is empty, load it
    if (!allRoutes || allRoutes.length === 0) {
      loadAllRoutes();
    }
  }, [state, fetched, allRoutes, loadAllRoutes]);

  // When cache is available and fetched participants are empty, pull them from cache
  useEffect(() => {
    if (state) return; // not needed for internal navigation
    if (!fetched || (fetched.participants?.length ?? 0) > 0) return;

    // Try to find this route in the cache and use its participants
    const fromCache = Array.isArray(allRoutes)
      ? allRoutes.find((r) => String(r.route_id) === String(route_id))
      : null;

    if (fromCache?.participants?.length) {
      setFetched((prev) => ({
        ...prev,
        participants: fromCache.participants, // fallback participants
      }));
    }
  }, [state, fetched, allRoutes, route_id]);

  const data = state ?? fetched;

  let {
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
  } = data || {};

  if (isOwner == null) {
    isOwner = currentUser?.user_id === user_id;
  }

  const { date_dd_mm_yyyy, time_hh_mm, weekday, isValid } =
    formatDateTime(date);
  const weekdayCap = isValid ? capitalizeFirstLetter(weekday) : "";

  const isCurrentUserEnrolled = useMemo(() => {
    return participants.some((p) => p.user_id === currentUser?.user_id);
  }, [participants, currentUser?.user_id]);

  const currentParticipants = 1 + participants.length;
  const isRouteFull = currentParticipants >= max_participants;

  const canAccessChat = isCurrentUserEnrolled || isOwner;

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
    <Grid container direction="column" spacing={2} sx={{ overflowX: "auto" }}>
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
            participants={
              participants
            } /* Will have data via state OR cache fallback */
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
          disabled={!canAccessChat}
          onClick={
            !canAccessChat
              ? undefined
              : () => {
                  navigate(`/chat/${route_id}`, {
                    state: {
                      title: `${starting_point} - ${ending_point}`,
                    },
                  });
                }
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
