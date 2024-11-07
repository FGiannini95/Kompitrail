import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

// Quiero que esté al principio mis motos y a su izquierda una flechita para volver a trás
// Un useeffect que me traiga todas las moto de un usuario  nombre/modelo/foto
// Si hay más de una foto tienen que verse en columna
// un button modificar moto y al lado un icono de basura para eliminar la moto
// Luego quiero un button de añadir más moto

export const Motorbike = () => {
  const navigate = useNavigate();
  return (
    <Grid2 container alignItems="center">
      <Grid2>
        <ArrowBackIosIcon onClick={() => navigate(-1)} />
      </Grid2>
      <Grid2>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mis motos
        </Typography>
      </Grid2>
    </Grid2>
  );
};
