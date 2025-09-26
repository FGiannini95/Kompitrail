import React, { useState } from "react";

// MUI
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// MUI-ICONS
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandMore = styled(({ expand, ...other }) => {
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
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
  route_description,
  handleOpenEditDialog,
  handleOpenDeleteDialog,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const InfoItem = ({ label, value }) => (
    <Grid item xs={6}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Grid>
  );

  return (
    <Card
      sx={{ maxWidth: 345, backgroundColor: "#eeeeee", borderRadius: "20px" }}
    >
      <CardHeader
        title={
          <Typography sx={{ fontWeight: "bold" }}>{route_name}</Typography>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image="https://via.placeholder.com/800x400.png?text=Ruta+de+Moto"
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
        <IconButton onClick={() => handleOpenEditDialog(route_id)}>
          <EditOutlinedIcon fontSize="medium" style={{ color: "black" }} />
        </IconButton>
        <IconButton onClick={() => handleOpenDeleteDialog(route_id)}>
          <DeleteOutlineIcon fontSize="medium" style={{ color: "black" }} />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon fontSize="large" style={{ color: "black" }} />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Información de la Ruta
          </Typography>
          <Grid container spacing={3} sx={{ textAlign: "center" }}>
            <InfoItem label="Distancia" value={`${distance} km`} />
            <InfoItem label="Tiempo estimado" value={`${estimated_time} h`} />
            <InfoItem label="Participantes" value={participants} />
            <InfoItem label="Nivel" value={level} />
            <InfoItem
              label="Motos aptas"
              value={<Typography>{suitable_motorbike_type}</Typography>}
            />
            <Grid item xs={12}>
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
  );
};
