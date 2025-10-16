import React, { useContext, useMemo, useState } from "react";
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

import { formatDateTime } from "../../../../helpers/utils";
import { RoutesString } from "../../../../routes/routes";

import { KompitrailContext } from "../../../../context/KompitrailContext";

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
  max_particpants,
  participants = [],
  is_verified,
  route_description,
  creator_name,
  onEdit,
  onDelete,
  onJoinRoute,
  onLeaveRoute,
  isOwner,
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

    const slotsAvailable = max_particpants - currentParticipants;
    const isRouteFull = slotsAvailable <= 0;

    // Number of empty slots  to display
    const emptySlotsCount = Math.max(0, max_particpants - currentParticipants);

    return {
      currentParticipants,
      isCurrentUserEnrolled,
      slotsAvailable,
      isRouteFull,
      emptySlotsCount,
    };
  }, [max_particpants, participants, currentUser?.user_id]);

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
        participants,
        is_verified,
        route_description,
      },
    });
  };

  const handleJoin = (e) => {
    e.stopPropagation();
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
      <CardContent onClick={handleOpenDetails}>
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
        <Box display="flex" flexWrap="wrap" gap={1} marginTop={1}>
          {isOwner ? (
            <BadgeAvatar
              targetUserId={currentUser?.user_id}
              name={currentUser?.name}
              size={40}
              showName
              onBadgeClick={() => {
                /*/ */
              }}
            />
          ) : (
            <BadgeAvatar
              targetUserId={currentUser?.user_id}
              name={currentUser?.name}
              size={40}
              showName
              showBadge={false}
            />
          )}
          {Array.from({ length: 5 }).map((_, i) => (
            <PlusAvatar
              key={`plus-${i}`}
              size={40}
              onClick={() => {
                /*/ */
              }}
            />
          ))}
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
