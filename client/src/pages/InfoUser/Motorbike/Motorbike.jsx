import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { MotorbikeDialog } from "../MotorbikeDialog/MotorbikeDialog";

export const Motorbike = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [motorbikes, setMotorbikes] = useState([]);
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // useEffect para cargar las motos del usuario
  useEffect(() => {
    // Simulación de fetch de datos de motos del usuario
    const fetchMotorbikes = async () => {
      // Aquí podrías hacer una llamada a la API para obtener las motos
      const mockMotorbikes = [
        {
          id: 1,
          brand: "motorbike 1",
          model: "model X",
          img: ["url_foto1"],
        },
        {
          id: 2,
          brand: "motorbike 2",
          model: "model Y",
          img: ["url_foto3"],
        },
      ];
      setMotorbikes(mockMotorbikes);
    };

    fetchMotorbikes();
  }, []);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mis motos
        </Typography>
      </Grid>
      <Grid item container direction="column" spacing={2}>
        {motorbikes.map((motorbike) => (
          <Grid key={motorbike.id} container spacing={1} alignItems="center">
            <Grid item xs={3}>
              {motorbike.img.map((foto, index) => (
                <img
                  key={index}
                  src={foto}
                  alt={motorbike.brand}
                  width="100%"
                />
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{motorbike.brand}</Typography>
              <Typography variant="body2">{motorbike.model}</Typography>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              <IconButton fontSize="large">
                <EditOutlinedIcon />
              </IconButton>
              <IconButton>
                <DeleteOutlineIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleOpenDialog}
        >
          + Añadir moto
        </Button>
      </Grid>
      <MotorbikeDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
      />
    </Grid>
  );
};
