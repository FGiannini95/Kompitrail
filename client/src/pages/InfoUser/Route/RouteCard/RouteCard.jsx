import React, { useEffect, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";

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

// Utils
import { formatDateTime } from "../../../../helpers/utils";
import { RoutesString } from "../../../../routes/routes";
import { getRouteStatus } from "../../../../helpers/oneRouteUtils";
// Components
import { RouteParticipantsSection } from "../../../../components/RouteParticipantsSection/RouteParticipantsSection";

export const RouteCard = ({
  route_id,
  user_id,
  starting_point,
  starting_point_short,
  ending_point,
  ending_point_short,
  date,
  level,
  distance,
  suitable_motorbike_type,
  estimated_time,
  max_participants,
  participants = [],
  is_verified,
  route_description,
  create_name,
  user_img,
  isOwner,
  showActions = true,
  created_at,
  lastRoutesVisit,
  enableNewBadge = false,
}) => {
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);
  const navigate = useNavigate();

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

  const [showNewIcon, setShowNewIcon] = useState(() => isNew);

  // If the route is considered new, show the icon for 3s
  useEffect(() => {
    if (!isNew) {
      setShowNewIcon(false);
      return;
    }

    setShowNewIcon(true);

    const timeoutId = setTimeout(() => {
      setShowNewIcon(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isNew]);

  const participantsSectionRef = useRef();

  const { isRouteLocked } = getRouteStatus(date, estimated_time);

  const handleOpenDetails = () => {
    // Guard to avoid pushing an invalid URL
    if (!route_id) return;
    // Build "/route/123" from "/route/:id"
    const url = generatePath(RoutesString.routeDetail, { id: route_id });
    navigate(url, {
      state: {
        starting_point,
        starting_point_short,
        ending_point,
        ending_point_short,
        date,
        level,
        distance,
        suitable_motorbike_type,
        estimated_time,
        max_participants,
        is_verified,
        route_description,
        user_id,
        participants,
        create_name,
        user_img,
        isOwner,
      },
    });
  };

  return (
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
            <Typography>{starting_point_short ?? starting_point}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FlagOutlinedIcon fontSize="medium" aria-hidden />
            <Typography>{ending_point_short ?? ending_point}</Typography>
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
      {showActions && !isRouteLocked && (
        <CardActions disableSpacing>
          {isOwner && (
            <>
              <IconButton
                onClick={() =>
                  participantsSectionRef.current?.handleOpenEditDialog(route_id)
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
          <Stack
            sx={{ ml: "auto" }}
            justifyContent="end"
            alignItems="flex-end"
            onClick={handleOpenDetails}
          >
            <ForwardOutlinedIcon fontSize="medium" aria-hidden />
          </Stack>
        </CardActions>
      )}
    </Card>
  );
};
