import React, { useState } from "react";

import {
  styled,
  Grid2 as Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

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
  onEdit,
  onDelete,
  isOwner,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
      <CardHeader
        sx={{ ".MuiCardHeader-content": { minWidth: 0 } }}
        title={
          <Typography
            sx={{
              fontWeight: "bold",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
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
          <Grid container spacing={3} sx={{ textAlign: "center" }}>
            <InfoItem label="Distancia" value={`${distance} km`} />
            <InfoItem label="Tiempo estimado" value={`${estimated_time} h`} />
            <InfoItem label="Participantes" value={participants} />
            <InfoItem label="Nivel" value={level} />
            <InfoItem
              label="Motos aptas"
              value={<Typography>{suitable_motorbike_type}</Typography>}
            />
            <Grid xs={12}>
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
