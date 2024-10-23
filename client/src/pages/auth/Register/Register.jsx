import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { RoutesString } from "../../../routes/routes";

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    //the handleSubmit function from react-hook-form will do some work behind the scene for us, like the valdiation and the prevent default
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Datos enviados:", data);

      const response = await axios.post(
        "http://localhost:3000/users/createuser",
        data
      );

      console.log("Respuesta del servidor:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setError("root", {
        message: "Error al crear el usuario. Intenta nuevamente.",
      });
    }
  };

  //TODO: validation
  //TODO: lastName llega undefined
  //TODO: handleCancel para limpar todos los campos

  return (
    <form
      style={{ paddingTop: "80px", display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            {...register("name")}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("lastName")}
            label="Apellidos"
            variant="outlined"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("email")}
            label="Correo"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("password")}
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {isSubmitting ? "Cargando..." : "Crear"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate(RoutesString.landing)}
          >
            Cancelar
          </Button>
        </Grid>

        {errors.root && (
          <Grid item xs={12}>
            <div className="text-red-500">{errors.root.message}</div>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
