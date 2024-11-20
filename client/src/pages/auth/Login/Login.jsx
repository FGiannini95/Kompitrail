import React, { useContext, useState } from "react";
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";

import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { saveLocalStorage } from "../../../helpers/localStorageUtils";
import Link from "@mui/material/Link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const initialValue = {
  email: "",
  password: "",
};

export const Login = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [login, setLogin] = useState(initialValue);
  const [msgError, setMsgError] = useState({
    email: "",
    password: "",
    global: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });

    // Clean up only the specific field
    if (msgError[name]) {
      setMsgError({
        ...msgError,
        [name]: "",
        global: "",
      });
    }
  };

  const handleCancel = () => {
    navigate(RoutesString.landing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation before the submit
    const errors = {};
    if (login.email === "") {
      errors.email = "El correo es obligatorio";
    }
    if (login.password === "") {
      errors.password = "La contraseña es obligatoria";
    }
    // This method extracts all the keys from the errors object and returns them as an array
    if (Object.keys(errors).length > 0) {
      setMsgError(errors);
      return;
    }

    axios
      .post("http://localhost:3000/users/loginuser", login)
      .then((res) => {
        setIsLogged(true);
        setUser(res.data.user);
        setToken(res.data.token);
        saveLocalStorage("token", res.data.token);
        navigate(RoutesString.home);
      })
      .catch((err) => {
        console.log(err);
        setMsgError({
          email: "",
          password: "",
          global: err.response?.data || "Error desconocido al iniciar sesión",
        });
      });
  };

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
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <Typography variant="h4">Login</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            onChange={handleChange}
            error={!!msgError.email}
            helperText={msgError.email}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            onChange={handleChange}
            error={!!msgError.password}
            helperText={msgError.password}
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              endAdornment: (
                <Button onClick={displayPassword}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </Button>
              ),
            }}
          />
        </Grid>
        {msgError.global && (
          <Grid item xs={12}>
            <Typography color="error" align="center">
              {msgError.global}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            ACEPTAR
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleCancel}
          >
            CANCELAR
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign="center">
            ¿Aún no tienes un perfil? ¡Regístrate{" "}
            <Link
              href={RoutesString.register}
              color="primary"
              underline="hover"
            >
              aquí
            </Link>
            !
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};
