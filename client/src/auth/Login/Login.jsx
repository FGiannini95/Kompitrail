import React, { useContext, useState } from "react";
import axios from "axios";
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
import { saveLocalStorage } from "../../helpers/localStorageUtils";
import { RoutesString } from "../../routes/routes";
import { USERS_URL } from "../../api";
// Providers & Hooks
import { KompitrailContext } from "../../context/KompitrailContext";
import { useRedirectParam } from "../../hooks/useRedirectParam";
import { usePostAuthRedirect } from "../../hooks/usePostAuthRedirect";
// Components
import { RestorePasswordDialog } from "../RestorePasswordDialog/RestorePasswordDialog";
import { SocialAuthButtons } from "../../components/Buttons/SocialAuthButtons/SocialAuthButtons";
import { Loading } from "../../components/Loading/Loading";

const initialValue = {
  email: "",
  password: "",
};

export const Login = () => {
  const { user, setUser, token, setToken, setIsLogged } =
    useContext(KompitrailContext);
  const [login, setLogin] = useState(initialValue);
  const [msgError, setMsgError] = useState({
    email: "",
    password: "",
    global: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [, setIsPasswordSelected] = useState(false);
  const [openRestorePasswordDialog, setOpenRestorePasswordDialog] =
    useState(false);
  const [redirectRequested, setRedirectRequested] = useState(false);
  const { t } = useTranslation(["buttons", "general", "forms"]);

  const navigate = useNavigate();
  const { buildUrl } = useRedirectParam();
  const { handlePostAuthRedirect } = usePostAuthRedirect();

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
      .post(`${USERS_URL}/loginuser`, login)
      .then((res) => {
        setToken(res.data.token);
        saveLocalStorage("token", res.data.token);
        setUser(res.data.user);
        setIsLogged(true);

        setRedirectRequested(true);
        handlePostAuthRedirect();
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

  const handleCloseDialog = () => {
    setOpenRestorePasswordDialog(false);
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
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="stretch"
              >
                <Grid size={12}>
                  <Typography variant="h5">
                    {" "}
                    {t("general:loginTitle")}
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <TextField
                    label={t("forms:emailLabel")}
                    name="email"
                    fullWidth
                    onChange={handleChange}
                    error={!!msgError.email}
                    helperText={msgError.email}
                    autoComplete="email"
                    inputProps={{
                      inputMode: "email", // mobile keyboard with @
                      autoCapitalize: "none", // avoid capitalizing emails
                      autoCorrect: "off", // no autocorrect on emails
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    label={t("forms:passwordLabel")}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    onChange={handleChange}
                    error={!!msgError.password}
                    helperText={msgError.password}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoComplete="current-password"
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

                {msgError.global && (
                  <Grid size={12}>
                    <Typography color="error" align="center">
                      {msgError.global}
                    </Typography>
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

                <Grid size={12}>
                  <Typography textAlign="center">
                    <Trans
                      i18nKey="noAccountRegisterText"
                      ns="general"
                      components={{
                        1: (
                          <Link
                            onClick={() =>
                              navigate(buildUrl(RoutesString.register))
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

                <Grid size={12}>
                  <Typography textAlign="center">
                    <Trans
                      i18nKey="forgotPasswordText"
                      ns="general"
                      components={{
                        1: (
                          <Link
                            onClick={() => setOpenRestorePasswordDialog(true)}
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

                <RestorePasswordDialog
                  openRestorePasswordDialog={openRestorePasswordDialog}
                  handleCloseDialog={handleCloseDialog}
                />
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
