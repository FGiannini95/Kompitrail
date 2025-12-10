import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  TextField,
  Box,
  Button,
  Link,
  Typography,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
// Utils
import { RoutesString } from "../../routes/routes";
import { USERS_URL } from "../../api";
import { capitalizeFirstLetter } from "../../helpers/utils";
// Hooks & Providers
import { useRedirectParam } from "../../hooks/useRedirectParam";
import { usePostAuthRedirect } from "../../hooks/usePostAuthRedirect";
import { KompitrailContext } from "../../context/KompitrailContext";
// Components
import { SocialAuthButtons } from "../../components/Buttons/SocialAuthButtons/SocialAuthButtons";
import { Loading } from "../../components/Loading/Loading";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const [redirectRequested, setRedirectRequested] = useState(false);
  const { t } = useTranslation(["buttons", "general", "forms"]);

  const navigate = useNavigate();
  const { buildUrl } = useRedirectParam();
  const { handlePostAuthRedirect } = usePostAuthRedirect();
  const { user, token } = useContext(KompitrailContext);

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
      navigate(buildUrl(RoutesString.login));
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

  const showLoading = redirectRequested && !(token && user);

  return (
    <>
      {showLoading && <Loading />}
      {!showLoading && (
        <Box
          sx={{
            pt: 4,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Box sx={{ maxWidth: 480, mx: "auto", width: "100%", px: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12} align="center">
                  <Typography variant="h5">
                    {" "}
                    {t("general:registerTitle")}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <TextField
                    {...register("name", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                      },
                      setValueAs: (v) => capitalizeFirstLetter(v),
                    })}
                    label={t("forms:nameLabel")}
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
                        message:
                          "Los apellidos deben tener al menos 2 caracteres",
                      },
                      setValueAs: (v) => capitalizeFirstLetter(v),
                    })}
                    label={t("forms:lastNameLabel")}
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Ingrese un correo válido",
                      },
                    })}
                    label={t("forms:emailLabel")}
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
                    label={t("forms:passwordLabel")}
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={displayPassword}
                          disableRipple
                          sx={(theme) => ({
                            color: theme.palette.text.secondary,
                            padding: 0.5,
                            // background when hovered with mouse
                            "&:hover": {
                              backgroundColor: theme.palette.kompitrail.card,
                            },
                            // background when focused via keyboard (TAB)
                            "&.Mui-focusVisible": {
                              backgroundColor: theme.palette.kompitrail.card,
                            },
                          })}
                        >
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
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                {errors.root && (
                  <Grid size xs={12}>
                    <Typography color="error">{errors.root.message}</Typography>
                  </Grid>
                )}

                <Grid container xs={12} spacing={2} justifyContent="center">
                  <Grid xs={6}>
                    <Button
                      type="button"
                      variant="outlined"
                      sx={(theme) => ({
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.kompitrail.card,
                        borderWidth: "2px",
                        "&:hover": {
                          borderColor: theme.palette.kompitrail.page,
                          borderWidth: "2px",
                        },
                      })}
                      fullWidth
                      onClick={handleCancel}
                    >
                      {t("buttons:cancel")}
                    </Button>
                  </Grid>
                  <Grid xs={6}>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={(theme) => ({
                        color: theme.palette.text.primary,
                        boxShadow: "none",
                        backgroundColor: theme.palette.kompitrail.card,
                        "&:hover": {
                          backgroundColor: theme.palette.kompitrail.page,
                        },
                      })}
                    >
                      {t("buttons:createProfile")}
                    </Button>
                  </Grid>
                </Grid>

                <Grid size xs={12}>
                  <Typography textAlign="center">
                    ¿Ya tienes un perfil? ¡Haz el login{" "}
                    <Link
                      onClick={() => navigate(buildUrl(RoutesString.login))}
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                      })}
                      underline="hover"
                    >
                      aquí
                    </Link>
                    !
                  </Typography>
                </Grid>
              </Grid>
            </form>
            <Box sx={{ mt: 3, mb: 2 }}>
              <SocialAuthButtons
                onAuthSuccess={() => {
                  setRedirectRequested(true);
                  handlePostAuthRedirect();
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
