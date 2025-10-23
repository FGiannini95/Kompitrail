import React, { useRef } from "react";
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
// Components
import { RouteParticipantsSection } from "../../../../components/RouteParticipantsSection/RouteParticipantsSection";

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
  isOwner,
  showActions = true,
}) => {
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);
  const navigate = useNavigate();

  const participantsSectionRef = useRef();

  const now = new Date();
  const routeDate = new Date(date);
  const isPastRoute = routeDate < now;

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
        user_id,
        participants,
        create_name,
        isOwner,
      },
    });
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
        <Box onClick={handleOpenDetails} sx={{ cursor: "pointer" }}>
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
        <RouteParticipantsSection
          ref={participantsSectionRef}
          route_id={route_id}
          user_id={user_id}
          create_name={create_name}
          participants={participants}
          max_participants={max_participants}
          isOwner={isOwner}
          isPastRoute={isPastRoute}
        />
      </CardContent>
      {showActions && !isPastRoute && (
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
                  style={{ color: "black" }}
                />
              </IconButton>
              <IconButton
                onClick={() =>
                  participantsSectionRef.current?.handleOpenDeleteDialog()
                }
              >
                <DeleteOutlineIcon
                  fontSize="medium"
                  style={{ color: "black" }}
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
