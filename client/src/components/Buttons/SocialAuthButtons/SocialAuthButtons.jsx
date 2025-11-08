import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { Stack, Typography } from "@mui/material";

import { AUTH_URL } from "../../../api";
import { saveLocalStorage } from "../../../helpers/localStorageUtils";

import { KompitrailContext } from "../../../context/KompitrailContext";

export const SocialAuthButtons = ({ onAuthSuccess }) => {
  const { setUser, setTokem, setIsLogged } = useContext(KompitrailContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setErrMsg("Falta de credenciales");
      return;
    }

    setIsLoading(true);
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

      setIsLogged(true);
      setUser(user);
      setTokem(token);
      saveLocalStorage("token", token);

      // Let the parent run the post-auth redirect
      if (typeof onAuthSuccess === "function") onAuthSuccess();
    } catch (e) {
      console.log("Autenticación fallida", e);
      setErrMsg("No se pudo iniciar sesión con Google. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrMsg("No se pudo iniciar sesión con Google. Intenta nuevamente.");
  };

  return (
    <Stack alignItems="center" pt={2}>
      <Typography>--------- o ---------</Typography>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        auto_select={true}
      />

      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          Conectandose a Google…
        </Typography>
      )}
      {errMsg && (
        <Typography variant="body2" color="error">
          {errMsg}
        </Typography>
      )}
      {/* Here below Apple Auth */}
    </Stack>
  );
};
