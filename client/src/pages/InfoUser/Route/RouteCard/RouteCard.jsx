import React, { useEffect, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

// Utils
import { formatDateTime } from "../../../../helpers/utils";
import { RoutesString } from "../../../../routes/routes";
import { getRouteStatus } from "../../../../helpers/oneRouteUtils";
import { getPointLabel } from "../../../../helpers/pointMetrics";
import { ROUTES_URL } from "../../../../api";
import {
  getLocalStorage,
  saveLocalStorage,
} from "../../../../helpers/localStorageUtils";
// Components
import { RouteParticipantsSection } from "../../../../components/RouteParticipantsSection/RouteParticipantsSection";
// Hooks & Providers
import { useReverseGeocoding } from "../../../../hooks/useReverseGeocoding";
import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
import { RouteCreateDialog } from "../RouteCreateDialog/RouteCreateDialog";

export const RouteCard = ({
  route,
  isOwner,
  showActions = true,
  lastRoutesVisit,
  enableNewBadge = false,
}) => {
  const {
    route_id,
    user_id,
    starting_point_i18n,
    ending_point_i18n,
    starting_lat,
    starting_lng,
    ending_lat,
    ending_lng,
    date,
    estimated_time,
    max_participants,
    participants = [],
    create_name,
    user_img,
    created_at,
  } = route;

  const { currentLang } = useReverseGeocoding();
  const { openDialog } = useRoutes();
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);
  const navigate = useNavigate();

  // Create point objects for utility function
  const startingPoint = {
    lat: starting_lat,
    lng: starting_lng,
    i18n: starting_point_i18n,
  };

  const endingPoint = {
    lat: ending_lat,
    lng: ending_lng,
    i18n: ending_point_i18n,
  };

  // Get labels in current language
  const startingLabel = getPointLabel(startingPoint, currentLang, "short");
  const endingLabel = getPointLabel(endingPoint, currentLang, "short");

  // Decide if this route should be considered "new" based on created_at and lastRoutesVisit
  const isNew = (() => {
    if (!enableNewBadge) return false;
    if (!created_at) return false;

    // Convert the value in a date object to have more consistency
    const createdAtDate = new Date(created_at);
    // Only compute if created_at is a valid date
    if (Number.isNaN(createdAtDate.getTime())) return false;

    // If there is no stored last visit, treat the route as new
    if (!lastRoutesVisit) {
      return true;
    }

    // Otherwise compare creation time to last visit
    return createdAtDate > lastRoutesVisit;
  })();

  // Check if we've already shown the NEW icon for this route to this user
  const hasSeenNewIcon =
    getLocalStorage(`route-new-seen-${route_id}`) === "true";

  // Show NEW only if route is new AND we haven't shown the icon before
  const shouldShowNew = isNew && !hasSeenNewIcon;

  const [showNewIcon, setShowNewIcon] = useState(shouldShowNew);

  // If the route is considered new, show the icon for 3s
  useEffect(() => {
    if (!shouldShowNew) {
      setShowNewIcon(false);
      return;
    }

    setShowNewIcon(true);

    const timeoutId = setTimeout(() => {
      setShowNewIcon(false);
      // Mark as seen AFTER the 3s timeout
      saveLocalStorage(`route-new-seen-${route_id}`, "true");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [shouldShowNew, route_id]);

  const participantsSectionRef = useRef();

  const { isRouteLocked } = getRouteStatus(date, estimated_time);

  const handleOpenDetails = () => {
    // Guard to avoid pushing an invalid URL
    if (!route_id) return;
    // Build "/route/123" from "/route/:id"
    const url = generatePath(RoutesString.routeDetail, { id: route_id });
    navigate(url, {
      state: {
        ...route,
        isOwner,
      },
    });
  };

  const handleReuseRoute = async (e) => {
    e.stopPropagation();

    try {
      // Fetch full route details including waypoints
      const response = await axios.get(`${ROUTES_URL}/oneroute/${route_id}`);
      const fullRouteData = response.data;

      openDialog({
        mode: "reuse",
        routeData: fullRouteData,
      });
    } catch (error) {
      console.error("Error fetching route details:", error);
      // Fallback: open dialog without waypoints
      openDialog({
        mode: "reuse",
        routeData: route,
      });
    }
  };

  return (
    <>
      <Card
        sx={(theme) => ({
          width: "100%",
          bgcolor: theme.palette.kompitrail.card,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          disabled: { isRouteLocked },
        })}
      >
        <CardContent>
          <Box
            onClick={handleOpenDetails}
            sx={{
              cursor: "pointer",
              color: isRouteLocked ? "text.disabled" : "text.primary",
            }}
          >
            <Box
              sx={{
                display: showNewIcon ? "flex" : "none",
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            >
              <FiberNewOutlinedIcon
                fontSize="large"
                aria-hidden
                sx={{ color: "green" }}
              />
            </Box>

            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnOutlinedIcon fontSize="medium" aria-hidden />
              <Typography>{startingLabel}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FlagOutlinedIcon fontSize="medium" aria-hidden />
              <Typography>{endingLabel}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarMonthIcon fontSize="medium" aria-hidden />
              <Typography>{date_dd_mm_yyyy}</Typography>
              <AccessTimeOutlinedIcon fontSize="medium" aria-hidden />
              <Typography>{time_hh_mm}</Typography>
            </Stack>
          </Box>
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

        {showActions && (
          <CardActions disableSpacing>
            {!isRouteLocked && isOwner && (
              <>
                <IconButton
                  onClick={() =>
                    participantsSectionRef.current?.handleOpenEditDialog(
                      route_id,
                    )
                  }
                >
                  <EditOutlinedIcon
                    fontSize="medium"
                    aria-hidden
                    sx={(theme) => ({
                      color: theme.palette.text.primary,
                    })}
                  />
                </IconButton>
                <IconButton
                  onClick={() =>
                    participantsSectionRef.current?.handleOpenDeleteDialog()
                  }
                >
                  <DeleteOutlineIcon
                    fontSize="medium"
                    aria-hidden
                    sx={(theme) => ({
                      color: theme.palette.text.primary,
                    })}
                  />
                </IconButton>
              </>
            )}

            <IconButton
              sx={{ ml: "auto" }}
              onClick={isRouteLocked ? handleReuseRoute : handleOpenDetails}
            >
              {isRouteLocked ? (
                <AutorenewOutlinedIcon
                  fontSize="medium"
                  aria-hidden
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                  })}
                />
              ) : (
                <ForwardOutlinedIcon
                  fontSize="medium"
                  aria-hidden
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                  })}
                />
              )}
            </IconButton>
          </CardActions>
        )}
      </Card>
      <RouteCreateDialog />
    </>
  );
};
