import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, Box, Typography } from "@mui/material";

import { RoutesString } from "../../routes/routes";
import { useRedirectParam } from "../../hooks/useRedirectParam";
import { SocialAuthButtons } from "../../components/Buttons/SocialAuthButtons/SocialAuthButtons";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { navigateWithRedirect } = useRedirectParam();

  const handleRegister = () =>
    navigateWithRedirect(navigate, RoutesString.register);
  const handleLogin = () => navigateWithRedirect(navigate, RoutesString.login);

  return (
    <Box paddingTop={4} textAlign="center" width="100%">
      <Typography variant="h5" fontWeight="bold">
        Bienvenid@ a Kompitrail
      </Typography>
      <Typography paddingTop={4}>
        Conéctate con otros moteros: comparte tus rutas, planifica aventuras y
        disfruta del camino en compañía. Ya sea que busques compañeros para una
        escapada de fin de semana o quieras explorar nuevas rutas, nuestra app
        te permite encontrar y unirte a moteros que comparten tu pasión. ¡No
        viajes solo, únete a la comunidad de Kompitrail y transforma cada viaje
        en una experiencia inolvidable!
      </Typography>
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        width="100%"
        paddingTop={4}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={handleRegister}
          sx={{
            color: "black",
            borderColor: "#eeeeee",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#dddddd",
              borderWidth: "2px",
            },
          }}
        >
          Registro
        </Button>
        <Button
          type="button"
          variant="contained"
          sx={{
            color: "black",
            boxShadow: "none",
            backgroundColor: "#eeeeee",
            "&:hover": { backgroundColor: "#dddddd" },
          }}
          onClick={handleLogin}
        >
          {" "}
          Log in
        </Button>
      </Box>
      <Box>
        <SocialAuthButtons />
      </Box>
    </Box>
  );
};
