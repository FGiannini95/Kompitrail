import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// Utils
import { RoutesString } from "../../../../routes/routes";
import { getLocalStorage } from "../../../../helpers/localStorageUtils";
import { USERS_URL } from "../../../../api";

export const EditPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const [error, setError] = useState("");
  const tokenLocalStorage = getLocalStorage("token");
  const { t } = useTranslation(["settings", "forms"]);

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
      .put(`${USERS_URL}/editpassword/${user_id}`, {
        id: user_id,
        password,
      })
      .then(() => {
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
          <ArrowBackIosIcon
            aria-hidden
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        </IconButton>
        <Typography variant="h6" color="text.primary">
          {t("settings:changePassword")}
        </Typography>
        <Button variant="text" disabled={!isValid} onClick={handleSave}>
          <SaveOutlinedIcon aria-hidden />
        </Button>
      </Grid>

      <Box sx={{ maxWidth: 480, mx: "auto", px: 2, pb: 2 }}>
        <Typography color="text.primary">
          La nueva contraseña debe tener al menos 8 caracteres y un carácter
          especial.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label={t("forms:newPassLabel")}
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
                    <VisibilityOffOutlinedIcon
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                  ) : (
                    <VisibilityOutlinedIcon
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                  )}
                </Button>
              ),
            }}
          />
        </Box>
        <Box item xs={12}>
          <TextField
            label={t("forms:confirmPassLabel")}
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
                    <VisibilityOffOutlinedIcon
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                  ) : (
                    <VisibilityOutlinedIcon
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                    />
                  )}
                </Button>
              ),
            }}
          />
        </Box>
      </Box>
    </Grid>
  );
};
