import React, { useState, useEffect, useContext } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";

import SportsMotorsportsOutlinedIcon from "@mui/icons-material/SportsMotorsportsOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../context/KompitrailContext";

const RETURN_KEY = "infoUser:returnTo";

export const TopBar = () => {
  const [animateIcon, setAnimateIcon] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(KompitrailContext);
  const { t } = useTranslation("general");

  const matchProfile = useMatch("/profile/:id");

  const noDesign =
    Boolean(matchProfile) ||
    [
      RoutesString.infouser,
      RoutesString.editUser,
      RoutesString.motorbike,
      RoutesString.settings,
      RoutesString.editPassword,
      RoutesString.itinerary,
      RoutesString.createRoute,
      RoutesString.editRoute,
      RoutesString.route,
      RoutesString.navigation,
      RoutesString.chatbot,
    ].includes(location.pathname) ||
    location.pathname.startsWith("/route/") ||
    location.pathname.startsWith("/chat/");

  useEffect(() => {
    if (location.pathname === RoutesString.home) {
      setAnimateIcon(true);

      // Deactivate the animation after 500ms
      const timer = setTimeout(() => {
        setAnimateIcon(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleIconMenuClick = () => {
    const from = location.pathname + location.search + location.hash;
    sessionStorage.setItem(RETURN_KEY, from);
    navigate(RoutesString.infouser);
  };

  const leftSideComponent = () => {
    switch (location.pathname) {
      case `${RoutesString.home}`:
        return (
          <Box
            sx={{
              display: noDesign ? "none" : "flex",
            }}
            flexDirection="row"
            alignItems="center"
            gap="10px"
          >
            <Typography variant="h6">{user.name}</Typography>
            <SportsMotorsportsOutlinedIcon
              sx={{
                transition: "transform 0.5s ease-in-out",
                transform: animateIcon ? "rotate(360deg)" : "none",
              }}
            />
          </Box>
        );
      case `${RoutesString.createTrip}`:
        return <Typography variant="h6">Crear ruta</Typography>;
      case `${RoutesString.chat}`:
        return <Typography variant="h6">{t("general:titleChat")}</Typography>;
      case `${RoutesString.profile}`:
        return (
          <Typography variant="h6">{t("general:titleProfile")}</Typography>
        );
      default:
        return null;
    }
  };

  const rightSideComponent = () => {
    return (
      <IconButton
        display="none"
        size="large"
        edge="end"
        color="inherit"
        aria-label="open drawer"
        sx={{ ml: 2 }}
        onClick={handleIconMenuClick}
      >
        <MenuIcon />
      </IconButton>
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={(theme) => ({
        backgroundColor: theme.palette.kompitrail.card,
        color: theme.palette.text.primary,
        boxShadow: "none",
        height: noDesign ? "0px" : "64px",
        display: noDesign ? "none" : "flex",
        justifyContent: "center",
      })}
    >
      <Toolbar>
        <Box
          sx={{
            display: noDesign ? "none" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {leftSideComponent()}
          {rightSideComponent()}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
