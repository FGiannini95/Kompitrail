import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { RoutesString } from "../../../routes/routes";

export const Register = () => {
  const initialFormState = {
    name: "",
    lastname: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  };

  const [register, setRegister] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegister({
      ...register,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!register.name) newErrors.name = "El nombre es requerido.";
    if (!register.lastname) newErrors.lastname = "Los apellidos son requerido.";
    if (!register.email) {
      newErrors.email = "El correo es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(register.email)) {
      newErrors.email = "El correo no es válido.";
    }
    if (!register.password) newErrors.password = "La contraseña es requerida.";
    if (register.password !== register.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Formulario enviado con éxito:", register);
      axios
        .post("http://localhost:3000/users/createuser", register)
        .then((res) => {
          console.log(res);
          navigate(RoutesString.login);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCancel = () => {
    setRegister(initialFormState);
    setErrors({});
    navigate("/");
    console.log("He limpiado todos los campos");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <Typography variant="h4">Formulario de Registro</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Nombre"
            name="name"
            fullWidth
            value={register.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Apellidos"
            name="lastname"
            fullWidth
            value={register.lastname}
            onChange={handleInputChange}
            error={!!errors.lastname}
            helperText={errors.lastname}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            fullWidth
            value={register.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Confirmar correo"
            name="confirmEmail"
            type="email"
            fullWidth
            value={register.confirmEmail}
            onChange={handleInputChange}
            error={!!errors.confirmEmail}
            helperText={errors.confirmEmail}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            value={register.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            fullWidth
            value={register.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrarse
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
            Cancelar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "blue", marginBottom: 2 }}
          >
            Ya estás registrado? Loguéate aqui!
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};
