import React, { useContext, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

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
  const { t } = useTranslation(["buttons", "general", "forms", "errors"]);

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
    control,
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
          message:
            error.response.data.message || t("errors:register.genericError"),
        });
      } else {
        setError("root", {
          message: t("errors:register.genericError2"),
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
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: t("errors:register.nameRequired"),
                      minLength: {
                        value: 2,
                        message: t("errors:register.nameMinLength"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("forms:nameLabel")}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const formattedValue =
                            capitalizeFirstLetter(rawValue);

                          // Normalize the name before storing it in the form state
                          field.onChange(formattedValue);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="lastname"
                    control={control}
                    rules={{
                      required: t("errors:register.lastNameRequired"),
                      minLength: {
                        value: 2,
                        message: t("errors:register.lastNameMinLength"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("forms:lastNameLabel")}
                        fullWidth
                        error={!!errors.lastname}
                        helperText={errors.lastname?.message}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const formattedValue =
                            capitalizeFirstLetter(rawValue);

                          // Normalize the name before storing it in the form state
                          field.onChange(formattedValue);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    {...register("email", {
                      required: t("errors:register.emailRequired"),
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: t("errors:register.emailInvalid"),
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
                      required: t("errors:register.passwordRequired"),
                      pattern: {
                        // Password with 8 caracteres and on of the has to be a special one
                        value: /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: t("errors:register.passwordWeak"),
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
                      {t("buttons:confirmar")}
                    </Button>
                  </Grid>
                </Grid>

                <Grid size xs={12}>
                  <Typography textAlign="center">
                    <Trans
                      i18nKey="haveAccountLoginText"
                      ns="general"
                      components={{
                        1: (
                          <Link
                            onClick={() =>
                              navigate(buildUrl(RoutesString.login))
                            }
                            sx={(theme) => ({
                              color: theme.palette.text.secondary,
                            })}
                            underline="hover"
                          />
                        ),
                      }}
                    />
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
