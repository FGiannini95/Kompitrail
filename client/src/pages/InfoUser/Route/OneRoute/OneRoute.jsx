import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import ChatIcon from "@mui/icons-material/Chat";

import {
  capitalizeFirstLetter,
  formatDateTime,
} from "../../../../helpers/utils";

const InfoItem = ({ label, value }) => (
  <Grid xs={6}>
    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Grid>
);

export const OneRoute = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    date,
    level,
    distance,
    suitable_motorbike_type,
    estimated_time,
    participants,
    is_verified,
    route_description,
  } = state || {};

  const { date_dd_mm_yyyy, time_hh_mm, weekday } = formatDateTime(date);
  const weekdayCap = capitalizeFirstLetter(weekday);
  const handleDelete = () => {
    console.log("Deleteing the route");
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <IconButton>
          <ShareOutlinedIcon style={{ color: "black" }} />
        </IconButton>
      </Grid>
      <Card
        sx={{
          width: "100%",
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
              value={`${weekdayCap} ${date_dd_mm_yyyy} - ${time_hh_mm}`}
            />
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <InfoItem label="Distancia" value={`${distance} km`} />
            <InfoItem label="Tiempo estimado" value={`${estimated_time} h`} />
            <InfoItem label="Nivel" value={level} />
          </Grid>
        </CardContent>
      </Card>
      <Stack sx={{ pl: 2 }}>
        <Typography
          sx={{
            display: "inline-flex",
            alignItems: "center",
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
          width: "100%",
          borderRadius: "2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Typography>Todos los avatar</Typography>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ p: "10px" }}
      >
        <Button
          type="button"
          variant="contained"
          sx={{
            color: "black",
            boxShadow: "none",
            backgroundColor: "#eeeeee",
            "&:hover": { backgroundColor: "#dddddd" },
          }}
          fullWidth
        >
          Calendario
          <CalendarMonthIcon
            style={{ paddingLeft: "5px", width: "20px" }}
            aria-hidden
          />
        </Button>

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "2px",
            },
          }}
        >
          Chat
          <ChatIcon style={{ paddingLeft: "5px", width: "20px" }} aria-hidden />
        </Button>
      </Stack>
      <Card
        sx={{
          width: "100%",
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
          <Typography>{`Max. ${participants} pilotos`} </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <TwoWheelerOutlinedIcon fontSize="medium" aria-hidden />
          <Typography>{`Motos apatas: ${suitable_motorbike_type}`} </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <DescriptionOutlinedIcon fontSize="medium" aria-hidden />
          <Typography>{route_description} </Typography>
        </Stack>
      </Stack>
      <Grid>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleDelete}
          sx={{
            color: "red",
            borderColor: "red",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "1px",
            },
          }}
        >
          Eliminar ruta/ Eliminar reserva
        </Button>
      </Grid>
    </Grid>
  );
};
