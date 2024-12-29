import React, { useState } from "react";

// MUI
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

// MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";

export const Itinerary = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [allItineraries, setItineraries] = useState([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const navigate = useNavigate();

  const handleOpenCreate = () => {
    setOpenCreate(true);
    navigate(RoutesString.createitinerary);
  };

  const handleOpenDelete = (route_id) => {
    setSelectedItineraryId(route_id);
    setOpenDelete(true);
  };

  const handleOpenEdit = (route_id) => {
    setSelectedItineraryId(route_id);
    openEdit(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenDelete(false);
    setOpenEdit(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Mis rutas</Typography>
      </Grid>
      <Grid item>
        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleOpenCreate}
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "1px",
            },
          }}
        >
          Crear ruta
          <AddOutlinedIcon style={{ paddingLeft: "5px", width: "20px" }} />
        </Button>
      </Grid>
    </Grid>
  );
};
