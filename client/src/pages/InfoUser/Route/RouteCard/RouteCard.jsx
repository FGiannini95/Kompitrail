import React, { useContext } from "react";
import { generatePath, useNavigate } from "react-router-dom";

import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";

import { formatDateTime } from "../../../../helpers/utils";
import { RoutesString } from "../../../../routes/routes";

import { BadgeAvatar } from "../../../../components/BadgeAvatar/BadgeAvatar";
import { KompitrailContext } from "../../../../context/KompitrailContext";

export const RouteCard = ({
  route_id,
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
  onEdit,
  onDelete,
  isOwner,
}) => {
  const navigate = useNavigate();
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);
  const { user } = useContext(KompitrailContext);

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
        <Grid display="flex" gap={1} marginTop={1}>
          {isOwner ? (
            <BadgeAvatar
              targetUserId={user?.user_id}
              name={user?.name}
              size={40}
              showName
              onBadgeClick={() => {
                /*/ */
              }}
            />
          ) : (
            <Avatar sx={{ width: 40, height: 40 }} />
          )}
          <Avatar />
          <Avatar />
          <Avatar />
        </Grid>
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
