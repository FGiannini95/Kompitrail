import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export const Register = () => {
  const initialFormState = {
    name: "",
    lastname: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = "El nombre es requerido.";
    if (!formValues.lastname)
      newErrors.lastname = "Los apellidos son requerido.";
    if (!formValues.email) {
      newErrors.email = "El correo es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "El correo no es válido.";
    }
    if (!formValues.password)
      newErrors.password = "La contraseña es requerida.";
    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Formulario enviado con éxito:", formValues);
    }
  };

  const handleCancel = () => {
    setFormValues(initialFormState);
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
            value={formValues.name}
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
            value={formValues.lastname}
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
            value={formValues.email}
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
            value={formValues.confirmEmail}
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
            value={formValues.password}
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
            value={formValues.confirmPassword}
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
