import React from "react";

import {
  Avatar,
  Badge,
  styled,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import { useRoutes } from "../../../../context/RoutesContext/RoutesContext";
import { formatDateTime } from "../../../../helpers/utils";

const ExpandMore = styled(IconButton)(({ expand }) => ({
  marginLeft: "auto",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.3s",
}));

export const RouteCard = ({
  route_name,
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
  const { expandedRouteId, handleExpandToggle } = useRoutes();
  const { date_dd_mm_yyyy, time_hh_mm } = formatDateTime(date);

  const InfoItem = ({ label, value }) => (
    <Grid xs={6}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Grid>
  );

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
        <Typography>Created by:{name} </Typography>
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
          <Badge
            overlap="circular"
            badgeContent="x"
            color="error"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            // Style the dot a bit bigger and add a white ring
            sx={{
              "& .MuiBadge-badge": {
                width: 16,
                height: 16,
                minWidth: 16,
                borderRadius: "50%",
              },
            }}
          >
            <Avatar />
          </Badge>
          <Avatar />
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
            <Typography sx={{ ml: "auto" }}>{"Federico"}</Typography>
          </>
        )}
      </CardActions>
    </Card>
    /*
    <Card
      sx={{
        width: "100%",
        bgcolor: "#eeeeee",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        sx={{ ".MuiCardHeader-content": { minWidth: 0 } }}
        title={
          <Typography
            sx={{
              fontWeight: "bold",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              textAlign: "center",
            }}
          >
            {route_name}
          </Typography>
        }
      />
      <CardMedia
        component="img"
        sx={{ height: 180, objectFit: "cover" }}
        image=""
        alt="Route img"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {starting_point} - {ending_point}
        </Typography>
        {
          //TODO: REPLACE THE CREATION DATE WITH THE ACTUAL DATE OF THE TRIP
        }
        <Typography>{date}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        {isOwner ? (
          <>
            <IconButton onClick={() => onEdit?.(route_id)}>
              <EditOutlinedIcon fontSize="medium" style={{ color: "black" }} />
            </IconButton>
            <IconButton onClick={() => onDelete?.(route_id)}>
              <DeleteOutlineIcon fontSize="medium" style={{ color: "black" }} />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => onEdit?.(route_id)}>
            <FavoriteBorderOutlinedIcon
              fontSize="medium"
              style={{ color: "black" }}
            />
          </IconButton>
        )}
        <ExpandMore
          expand={expandedRouteId === route_id ? 1 : 0}
          onClick={() => handleExpandToggle(route_id)}
          aria-expanded={expandedRouteId === route_id}
          aria-label="show more"
        >
          <ExpandMoreIcon fontSize="large" style={{ color: "black" }} />
        </ExpandMore>
      </CardActions>
      <Collapse in={expandedRouteId === route_id} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: 3 }}>
          <Box sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
            <Box component="span">Ruta {""}</Box>
            {is_verified === 0 ? "conocida" : "nueva"}
          </Box>
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <InfoItem label="Distancia" value={`${distance} km`} />
            <InfoItem label="Tiempo estimado" value={`${estimated_time} h`} />
            <InfoItem label="Participantes" value={participants} />
            <InfoItem label="Nivel" value={level} />
            <Grid size={12}>
              <InfoItem label="Motos aptas" value={suitable_motorbike_type} />
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Descripción
              </Typography>
              <Typography sx={{ textAlign: "left" }}>
                {route_description}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
    */
  );
};
