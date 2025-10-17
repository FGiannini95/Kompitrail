import React, { useContext, useMemo } from "react";
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
// Utils
import { formatDateTime } from "../../../../helpers/utils";
import { RoutesString } from "../../../../routes/routes";
// Providers
import { KompitrailContext } from "../../../../context/KompitrailContext";
// Components
import { BadgeAvatar } from "../../../../components/BadgeAvatar/BadgeAvatar";
import { PlusAvatar } from "../../../../components/PlusAvatar/PlusAvatar";

export const RouteCard = ({
  route_id,
  user_id,
  starting_point,
  ending_point,
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
  onEdit,
  onDelete,
  onJoinRoute,
  onLeaveRoute,
  isOwner,
  isJoining,
}) => {
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);
  const { user: currentUser } = useContext(KompitrailContext);
  const navigate = useNavigate();

  const enrollmentInfo = useMemo(() => {
    // Creator + enrolled user
    const currentParticipants = 1 + participants.length;

    // Check if current user is already enrolled
    const isCurrentUserEnrolled = participants.some(
      (p) => p.user_id === currentUser?.user_id
    );

    const slotsAvailable = max_participants - currentParticipants;
    const isRouteFull = slotsAvailable <= 0;

    // Number of empty slots  to display
    const emptySlotsCount = Math.max(0, max_participants - currentParticipants);

    return {
      currentParticipants,
      isCurrentUserEnrolled,
      slotsAvailable,
      isRouteFull,
      emptySlotsCount,
    };
  }, [max_participants, participants, currentUser?.user_id]);

  // - NOT clickable if: user is creator OR user is already enrolled OR route is full
  const canJoinRoute =
    !isOwner &&
    !enrollmentInfo.isCurrentUserEnrolled &&
    !enrollmentInfo.isRouteFull &&
    !isJoining;

  const handleOpenDetails = () => {
    // Guard to avoid pushing an invalid URL
    if (!route_id) return;
    // Build "/route/123" from "/route/:id"
    const url = generatePath(RoutesString.routeDetail, { id: route_id });
    navigate(url, {
      state: {
        starting_point,
        ending_point,
        date,
        level,
        distance,
        suitable_motorbike_type,
        estimated_time,
        max_participants,
        is_verified,
        route_description,
      },
    });
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    if (!canJoinRoute) return;
    onJoinRoute?.(route_id);
  };

  const handleLeave = (e) => {
    e.stopPropagation();
    onLeaveRoute?.(route_id);
  };

  return (
    <Card
      sx={{
        width: "100%",
        bgcolor: "#eeeeee",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Box onClick={handleOpenDetails}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnOutlinedIcon fontSize="medium" aria-hidden />
            <Typography>{starting_point}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FlagOutlinedIcon fontSize="medium" aria-hidden />
            <Typography>{ending_point}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonthIcon fontSize="medium" aria-hidden />
            <Typography>{date_dd_mm_yyyy}</Typography>
            <AccessTimeOutlinedIcon fontSize="medium" aria-hidden />
            <Typography>{time_hh_mm}</Typography>
          </Stack>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1} marginTop={1}>
          {/* 1. CREATOR AVATAR - Always first */}
          <BadgeAvatar
            targetUserId={user_id}
            name={create_name}
            size={40}
            showName
            onBadgeClick={() => onDelete?.(route_id)}
          />

          {/* 2. ENROLLED PARTICIPANTS */}
          {participants.map((participant) => {
            const isCurrentUser = participant.user_id === currentUser?.user_id;

            return (
              <BadgeAvatar
                key={participant.user_id}
                targetUserId={participant.user_id}
                name={participant.name}
                size={40}
                showName
                onBadgeClick={handleLeave}
              />
            );
          })}

          {/* 3. EMPTY SLOTS - "+" buttons (only if not owner and not enrolled) */}
          {Array.from({ length: enrollmentInfo.emptySlotsCount }).map(
            (_, i) => (
              <PlusAvatar
                key={`empty-slot-${i}`}
                size={40}
                onClick={handleJoin}
                disabled={!canJoinRoute}
              />
            )
          )}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        {isOwner && (
          <>
            <IconButton onClick={() => onEdit?.(route_id)}>
              <EditOutlinedIcon fontSize="medium" style={{ color: "black" }} />
            </IconButton>
            <IconButton onClick={() => onDelete?.(route_id)}>
              <DeleteOutlineIcon fontSize="medium" style={{ color: "black" }} />
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
    </Card>
  );
};
