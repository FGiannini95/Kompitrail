import React, { useContext, useState } from "react";

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
import { jwtDecode } from "jwt-decode";
import { RoutesString } from "../../../../routes/routes";
import { getLocalStorage } from "../../../../helpers/localStorageUtils";

export const EditPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const [error, setError] = useState("");
  const tokenLocalStorage = getLocalStorage("token");

  const navigate = useNavigate();

  // Regular expresion to validate the password as we have in the register
  const passwordPattern = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const displayPassword = () => {
    setShowPassword(!showPassword);
  };

  const displayConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFocus = () => {
    setIsPasswordSelected(true);
  };

  const handleBlur = () => {
    // Both input are filled but with different value
    if (password && confirmPassword && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    }
    // The password doesn't pass the regex
    else if (!passwordPattern.test(password)) {
      setError("La contraseña no es lo suficientemente fuerte");
    }
    // We have the same value
    else {
      setError("");
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    // It checks if the password matches the required pattern
    if (!passwordPattern.test(password)) {
      return {
        isValid: false,
        error: "La contraseña no es lo suficientemente fuerte",
      };
    }
    // It checks if the password and confirm password match
    if (confirmPassword && password !== confirmPassword) {
      return { isValid: false, error: "Las contraseñas no coinciden" };
    }

    return { isValid: true, error: "" };
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePasswords(value, confirmPassword);
    setError(validation.error);
    setIsValid(validation.isValid);
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const validation = validatePasswords(password, value);
    setError(validation.error);
    setIsValid(validation.isValid);
  };

  const handleSave = () => {
    const { user_id } = jwtDecode(tokenLocalStorage).user;
    axios
      .put(`http://localhost:3000/users/editpassword/${user_id}`, {
        id: user_id,
        password,
      })
      .then((res) => {
        console.log(res.data);
        navigate(RoutesString.infouser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon style={{ color: "black" }} />
        </IconButton>
        <Typography variant="h6">Modificar contraseña</Typography>
        <Button
          variant="text"
          color="black"
          disabled={!isValid}
          onClick={handleSave}
        >
          Guardar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          La nueva contraseña debe tener al menos 8 caracteres y un carácter
          especial.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Nueva contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={!!error}
          helperText={error}
          InputProps={{
            endAdornment: (
              <Button onClick={displayPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ color: "#aaaaaa" }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ color: "#aaaaaa" }} />
                )}
              </Button>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={handleConfirmPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={!!error}
          helperText={error}
          InputProps={{
            endAdornment: (
              <Button onClick={displayConfirmPassword}>
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ color: "#aaaaaa" }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ color: "#aaaaaa" }} />
                )}
              </Button>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};
