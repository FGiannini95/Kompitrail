import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { Card, CardContent, Stack, Typography, Divider } from "@mui/material";
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
import { ROUTES_URL } from "../../../../api";
// Providers & Hooks
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useShareUrl } from "../../../../hooks/useShareUrl";
// Components
import { RouteParticipantsSection } from "../../../../components/RouteParticipantsSection/RouteParticipantsSection";
import { openCalendar } from "../../../../helpers/calendar";
import { OutlinedButton } from "../../../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../../../components/Buttons/ContainedButton/ContainedButton";
import { Header } from "../../../../components/Header/Header";
import { RouteActionButton } from "../RouteActionButton/RouteActionButton";

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
  const [data, setData] = useState(state ?? null); // state only as initial value
  const { id: route_id } = useParams();
  const { user: currentUser } = useContext(KompitrailContext);
  const { isCopied, handleShare } = useShareUrl({
    mode: "route",
    routeId: route_id,
  });
  const { t, i18n } = useTranslation(["buttons", "oneRoute", "forms"]);
  const navigate = useNavigate();

  const localeMap = {
    es: "es-ES",
    en: "en-GB",
    it: "it-IT",
  };
  const currentLang = i18n.language?.slice(0, 2) || "es";
  const locale = localeMap[currentLang] ?? "es-ES";

  const participantsSectionRef = useRef();

  useEffect(() => {
    if (!route_id) return;

    let cancelled = false;

    (async () => {
      try {
        // Fetch the route
        const { data: routeRaw } = await axios.get(
          `${ROUTES_URL}/oneroute/${route_id}?lang=${currentLang}`
        );
        const route = routeRaw ?? {};

        if (!cancelled) {
          setData(route);
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
  }, [route_id, currentLang]);

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

  const { date_dd_mm_yyyy, time_hh_mm, weekday, isValid } = formatDateTime(
    date,
    { locale }
  );
  const weekdayCap = isValid ? capitalizeFirstLetter(weekday) : "";

  const isCurrentUserEnrolled = useMemo(() => {
    return participants.some((p) => p.user_id === currentUser?.user_id);
  }, [participants, currentUser?.user_id]);

  const currentParticipants = 1 + participants.length;
  const isRouteFull = currentParticipants >= max_participants;

  const canAccessChat = isCurrentUserEnrolled || isOwner;

  const now = new Date();
  const routeStart = new Date(date);
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const routeDurationMs = (Number(estimated_time) || 0) * ONE_HOUR_MS;

  const routeEnd = new Date(routeStart.getTime() + routeDurationMs);
  const enrollmentDeadline = new Date(routeStart.getTime() - ONE_HOUR_MS);
  const isPastRoute = now >= routeEnd;
  // isEnrollmentClosed is true from 1h before the start till the end of the route
  const isEnrollmentClosed = now >= enrollmentDeadline && now < routeEnd;

  const isRouteLocked = isPastRoute || isEnrollmentClosed;

  const handleOpenCalendar = !isRouteLocked
    ? () =>
        openCalendar({
          starting_point,
          ending_point,
          dateISO: date,
          estimated_time,
        })
    : undefined;

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      sx={{ overflowX: "auto", paddingBottom: 3 }}
    >
      <Header onShare={handleShare} isCopied={isCopied} />
      <Card
        sx={(theme) => ({
          width: "95%",
          ml: "10px",
          bgcolor: theme.palette.kompitrail.card,
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        })}
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
                  ? t("oneRoute:date.dateLabel", {
                      weekday: weekdayCap,
                      date: date_dd_mm_yyyy,
                      time: time_hh_mm,
                    })
                  : t("oneRoute:date.unavailable")
              }
            />
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <InfoItem
              label={t("oneRoute:info.kmLabel")}
              value={`${distance} km`}
            />
            <InfoItem
              label={t("oneRoute:info.estimatedTimeLable")}
              value={`${estimated_time} h`}
            />
            <InfoItem
              label={t("oneRoute:info.levelLabel")}
              value={t(`forms:level.${level}`)}
            />
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
          color="text.primary"
        >
          {is_verified === 0 ? (
            <VerifiedOutlinedIcon fontSize="medium" aria-hidden />
          ) : (
            <NewReleasesOutlinedIcon fontSize="medium" aria-hidden />
          )}
          {is_verified === 0
            ? t("oneRoute:status.knownRoute")
            : t("oneRoute:status.newRoute")}
        </Typography>
      </Stack>

      <Card
        sx={(theme) => ({
          width: "95%",
          ml: "10px",
          bgcolor: theme.palette.kompitrail.card,
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        })}
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
            isRouteLocked={isRouteLocked}
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
          text={t("oneRoute:calendar")}
          icon={
            <CalendarMonthIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
          disabled={!canAccessChat || isRouteLocked}
        />

        <OutlinedButton
          text={t("oneRoute:chat")}
          icon={
            <ChatIcon
              style={{ paddingLeft: "5px", width: "20px" }}
              aria-hidden
            />
          }
          disabled={!canAccessChat || isRouteLocked}
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
        sx={(theme) => ({
          width: "95%",
          ml: "10px",
          bgcolor: theme.palette.kompitrail.card,
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <CardContent sx={{ padding: 3 }}>
          <Typography>Aqui va en enlace para maps</Typography>
        </CardContent>
      </Card>

      <Stack sx={{ pl: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} color="text.primary">
          {t("oneRoute:info.generalInfoTitle")}
        </Typography>
        <Stack direction="row" spacing={0.75}>
          <Groups2OutlinedIcon
            fontSize="medium"
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
          <Typography color="text.primary">
            {t("oneRoute:info.maxParticipantsLabel", {
              count: max_participants,
            })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <TwoWheelerOutlinedIcon
            fontSize="medium"
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
          <Typography color="text.primary">
            {t("oneRoute:info.motorbikeTypeLabel", {
              types: suitable_motorbike_type,
            })}{" "}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <DescriptionOutlinedIcon
            fontSize="medium"
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
          <Typography color="text.primary">{route_description} </Typography>
        </Stack>
      </Stack>
      <Stack sx={{ px: 1 }}>
        <RouteActionButton
          isPastRoute={isPastRoute}
          isEnrollmentClosed={isEnrollmentClosed}
          isOwner={isOwner}
          isCurrentUserEnrolled={isCurrentUserEnrolled}
          isRouteFull={isRouteFull}
          onDeleteRoute={() =>
            participantsSectionRef.current?.handleOpenDeleteDialog()
          }
          onJoinRoute={() => participantsSectionRef.current?.handleJoin()}
          onCancelEnrollment={() =>
            participantsSectionRef.current?.handleOpenLeaveRoute()
          }
        />
      </Stack>
    </Grid>
  );
};
