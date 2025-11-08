import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { TextField, Button, Link, Typography } from "@mui/material";
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
import { clearRedirectTarget } from "../redirectTarget";
import { usePostAuthRedirect } from "../../hooks/usePostAuthRedirect";
// Components
import { RestorePasswordDialog } from "../RestorePasswordDialog/RestorePasswordDialog";
import { SocialAuthButtons } from "../../components/Buttons/SocialAuthButtons/SocialAuthButtons";

const initialValue = {
  email: "",
  password: "",
};

export const Login = () => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
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
  const navigate = useNavigate();
  const { redirectValue, buildUrl } = useRedirectParam();
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
        setIsLogged(true);
        setUser(res.data.user);
        setToken(res.data.token);
        saveLocalStorage("token", res.data.token);

        // If redirectValue exists and it is safe use it, otherwise fallback to home
        const target = redirectValue?.startsWith("/")
          ? redirectValue
          : RoutesString.home;
        // NAvigation + clear sessionStorage to avoid loops
        navigate(target, { replace: true });
        clearRedirectTarget();
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={12} align="center">
            <Typography variant="h4">Login</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              onChange={handleChange}
              error={!!msgError.email}
              helperText={msgError.email}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={handleChange}
              error={!!msgError.password}
              helperText={msgError.password}
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
          {msgError.global && (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                {msgError.global}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                color: "black",
                boxShadow: "none",
                backgroundColor: "#eeeeee",
                "&:hover": { backgroundColor: "#dddddd" },
              }}
            >
              ACEPTAR
            </Button>
          </Grid>

          <Grid item xs={12}>
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
              CANCELAR
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign="center">
              ¿Aún no tienes un perfil? ¡Regístrate{" "}
              <Link
                onClick={() => navigate(buildUrl(RoutesString.register))}
                color="#777777"
                underline="hover"
              >
                aquí
              </Link>
              !
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography textAlign="center">
              ¿Has olvidado tu contraseña? Pincha{" "}
              <Link
                onClick={() => setOpenRestorePasswordDialog(true)}
                color="#777777"
                underline="hover"
              >
                aquí
              </Link>
              !
            </Typography>
          </Grid>
          <RestorePasswordDialog
            openRestorePasswordDialog={openRestorePasswordDialog}
            handleCloseDialog={handleCloseDialog}
          />
        </Grid>
      </form>
      <SocialAuthButtons onAuthSuccess={handlePostAuthRedirect} />
    </>
  );
};
