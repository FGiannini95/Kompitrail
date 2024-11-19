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

const initialValue = {
  email: "",
  password: "",
};

export const Login = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [login, setLogin] = useState(initialValue);
  const [msgError, setMsgError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate(RoutesString.landing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        setMsgError(err.response.data);
      });
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
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
            {typeof msgError === "string" ? msgError : JSON.stringify(msgError)}
          </Typography>
        </Grid>

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
