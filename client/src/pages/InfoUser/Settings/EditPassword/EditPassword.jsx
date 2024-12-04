import React, { useState } from "react";

//MUI
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

//MUI-ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useNavigate } from "react-router-dom";
import axios from "axios";

export const EditPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const navigate = useNavigate();

  const displayPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsPasswordSelected(true);
  };

  const handleBlur = () => {
    setIsPasswordSelected(false);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Modificar contraseña</Typography>
        <Button variant="text" color="black" disabled>
          Guardar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Contraseña actual"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <Button onClick={displayPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ color: "black" }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ color: "black" }} />
                )}
              </Button>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>
          La nueva contraseña tiene que incluir x carácteres y un seño especial.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Nueva contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <Button onClick={displayPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ color: "black" }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ color: "black" }} />
                )}
              </Button>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Confirmar contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <Button onClick={displayPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ color: "black" }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ color: "black" }} />
                )}
              </Button>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};
