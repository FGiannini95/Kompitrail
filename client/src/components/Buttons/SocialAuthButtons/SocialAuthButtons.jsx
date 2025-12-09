import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { AUTH_URL } from "../../../api";
import { saveLocalStorage } from "../../../helpers/localStorageUtils";

import { KompitrailContext } from "../../../context/KompitrailContext";

export const SocialAuthButtons = ({ onAuthSuccess }) => {
  const { setUser, setToken, setIsLogged } = useContext(KompitrailContext);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    if (isGoogleLoading) return;
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setErrMsg("Falta de credenciales");
      return;
    }

    setIsGoogleLoading(true);
    setErrMsg("");

    try {
      // Send IdToken to BE
      const res = await axios.post(`${AUTH_URL}/google`, {
        id_token: idToken,
      });

      // Return the same data object as the login
      const { token, user } = res.data || {};
      if (!token || !user) {
        throw new Error("Error en el token o en el usuario");
      }

      setToken(token);
      saveLocalStorage("token", token);
      setUser(user);
      setIsLogged(true);
      // Let the parent run the post-auth redirect
      onAuthSuccess?.();
    } catch (e) {
      console.log("Autenticación fallida", e);
      setErrMsg("No se pudo iniciar sesión con Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrMsg("No se pudo iniciar sesión con Google.");
  };

  return (
    <Stack alignItems="stretch" pt={2} spacing={2} sx={{ width: "100%" }}>
      <Divider
        sx={{
          width: "100%",
          "&::before, &::after": { borderTopWidth: 2 },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          o
        </Typography>
      </Divider>

      {/* Google Auth */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          auto_select={true}
        />
      </Box>

      {/* Loading & error states */}
      {isGoogleLoading && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Conectándose a Google…
        </Typography>
      )}
      {errMsg && (
        <Typography variant="body2" color="error" textAlign="center">
          {errMsg}
        </Typography>
      )}
    </Stack>
  );
};
