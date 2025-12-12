import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Box, Typography } from "@mui/material";

import { RoutesString } from "../../routes/routes";
import { useRedirectParam } from "../../hooks/useRedirectParam";

export const LandingPage = () => {
  const { t } = useTranslation(["buttons", "general"]);

  const navigate = useNavigate();
  const { navigateWithRedirect } = useRedirectParam();

  const handleRegister = () =>
    navigateWithRedirect(navigate, RoutesString.register);

  const handleLogin = () => navigateWithRedirect(navigate, RoutesString.login);

  return (
    <Box
      sx={{
        pt: 4,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: 480, mx: "auto", width: "100%", px: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {t("general:landingTitle")}
        </Typography>
        <Typography paddingTop={4}>{t("general:introLanding")}</Typography>
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
            sx={(theme) => ({
              color: theme.palette.text.primary,
              borderColor: theme.palette.kompitrail.card,
              borderWidth: "2px",
              "&:hover": {
                borderColor: theme.palette.kompitrail.page,
                borderWidth: "2px",
                backgroundColor: "transparent",
              },
            })}
          >
            {t("buttons:register")}
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={(theme) => ({
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.kompitrail.card,
              boxShadow: "none",
              "&:hover": { backgroundColor: theme.palette.kompitrail.page },
            })}
            onClick={handleLogin}
          >
            {" "}
            {t("buttons:login")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
