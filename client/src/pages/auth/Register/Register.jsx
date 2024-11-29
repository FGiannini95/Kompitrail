import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { RoutesString } from "../../../routes/routes";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { jwtDecode } from "jwt-decode";
import { KompitrailContext } from "../../../../context/KompitrailContext";
import { saveLocalStorage } from "../../../helpers/localStorageUtils";

export const Register = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const [, setGoogleUser] = useState({});
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

  const handleGoogleSignInCallback = (response) => {
    //It receives a response object from Google, which contains a JWT credential.
    var userObject = jwtDecode(response.credential);
    const { email, given_name, family_name, picture } = userObject;

    axios
      .post("http://localhost:3000/users/googlelogin", {
        email,
        given_name,
        family_name,
        picture,
      })
      .then((res) => {
        console.log(res.data);
        setIsLogged(true);
        setUser(res.data.user);
        setToken(res.data.token);
        saveLocalStorage("token", res.data.token);
        navigate(RoutesString.home);
      })
      .catch((err) => {
        console.error("Google Login Failed:", err.response?.data || err);
      });

    // The user data is stored in the googleUser state.
    setGoogleUser(userObject);
    document.getElementById("signInDiv").hidden = false;
  };

  useEffect(() => {
    // global google object
    const google = window.google;
    google.accounts.id.initialize({
      client_id:
        "171268761879-g9dn1g2g0q78jn9q5vvs10eo643cu2s2.apps.googleusercontent.com",
      callback: handleGoogleSignInCallback,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      them: "outline",
      size: "medium",
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <Typography variant="h4">Registro</Typography>
        </Grid>
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
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </Button>
              ),
            }}
          />
        </Grid>
        {errors.root && (
          <Grid item xs={12}>
            <Typography color="error">{errors.root.message}</Typography>
          </Grid>
        )}
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
        <Grid item xs={12}>
          <Typography textAlign="center">
            ¿Ya tienes un perfil? ¡Haz el login{" "}
            <Link href={RoutesString.login} color="primary" underline="hover">
              aquí
            </Link>
            !
          </Typography>
        </Grid>
      </Grid>
      <div id="signInDiv"></div>
    </form>
  );
};
