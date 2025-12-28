import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import { RoutesString } from "../../routes/routes";
import { useRedirectParam } from "../../hooks/useRedirectParam";
import { OutlinedButton } from "../../components/Buttons/OutlinedButton/OutlinedButton";
import { ContainedButton } from "../../components/Buttons/ContainedButton/ContainedButton";

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
          gap={2}
        >
          <OutlinedButton
            onClick={handleRegister}
            text={t("buttons:register")}
          />
          <ContainedButton onClick={handleLogin} text={t("buttons:login")} />
        </Box>
      </Box>
    </Box>
  );
};
