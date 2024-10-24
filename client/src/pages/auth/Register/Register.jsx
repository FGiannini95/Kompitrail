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
    reset,
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

  const handleCancel = () => {
    reset();
  };

  //TODO: lastName llega undefined

  return (
    <form
      style={{ paddingTop: "80px", display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres",
              },
            })}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("lastName", {
              required: "Los apellidos son obligatorio",
              minLength: {
                value: 2,
                message: "Los apellidos deben tener al menos 2 caracteres",
              },
            })}
            label="Apellidos"
            variant="outlined"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Ingrese un correo válido",
              },
            })}
            label="Correo"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register("password", {
              required: "La contraseña es obligatoria",
              pattern: {
                value: /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.",
              },
            })}
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
            onClick={handleCancel}
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
