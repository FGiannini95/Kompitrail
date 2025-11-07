import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../../routes/routes";
import { Stack, Typography } from "@mui/material";

export const SocialAuthButtons = () => {
  const navigate = useNavigate();
  return (
    <Stack alignItems="center" pt={2}>
      <Typography>--------- o ---------</Typography>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          navigate(RoutesString.home);
        }}
        onError={() => console.log("login fallido")}
        auto_select={true}
      />
    </Stack>
  );
};
