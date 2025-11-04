import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { TextField, Button, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
// Utils
import { RoutesString } from "../../../routes/routes";
import { USERS_URL } from "../../../api";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
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
      const response = await axios.post(`${USERS_URL}/createuser`, data);
      console.log("Respuesta del servidor:", response.data);
      navigate(RoutesString.login);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      // Mostrar un mensaje de error más claro si el correo ya está en uso
      if (error.response && error.response.status === 400) {
        setError("root", {
          message: error.response.data.message || "Error desconocido.",
        });
      } else {
        setError("root", {
          message: "Ha ocurrido un error inesperado. Intenta nuevamente.",
        });
      }
    }
  };

  // Reset all the fields of the form
  const handleCancel = () => {
    reset();
    navigate(RoutesString.landing);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12} align="center">
          <Typography variant="h4">Registro</Typography>
        </Grid>
        <Grid size={12}>
          <TextField
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres",
              },
            })}
            label="Nombre"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            {...register("lastname", {
              required: "Los apellidos son obligatorio",
              minLength: {
                value: 2,
                message: "Los apellidos deben tener al menos 2 caracteres",
              },
            })}
            label="Apellidos"
            variant="outlined"
            fullWidth
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
          />
        </Grid>
        <Grid size={12}>
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
        <Grid size={12}>
          <TextField
            {...register("password", {
              required: "La contraseña es obligatoria",
              pattern: {
                // Password with 8 caracteres and on of the has to be a special one
                value: /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "La contraseña no es suficientemente fuerte",
              },
            })}
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
        {errors.root && (
          <Grid size xs={12}>
            <Typography color="error">{errors.root.message}</Typography>
          </Grid>
        )}
        <Grid size xs={12}>
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            sx={{
              color: "black",
              boxShadow: "none",
              backgroundColor: "#eeeeee",
              "&:hover": { backgroundColor: "#dddddd" },
            }}
            fullWidth
          >
            {isSubmitting ? "Cargando..." : "Crear"}
          </Button>
        </Grid>
        <Grid size xs={12}>
          <Button
            type="button"
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#eeeeee",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#dddddd",
                borderWidth: "2px",
              },
            }}
            fullWidth
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid size xs={12}>
          <Typography textAlign="center">
            ¿Ya tienes un perfil? ¡Haz el login{" "}
            <Link href={RoutesString.login} color="#777777" underline="hover">
              aquí
            </Link>
            !
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};
