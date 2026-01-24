import React from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import { AppBar, Box, Toolbar, IconButton } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

import { RoutesString } from "../../routes/routes";

export const NavBarApp = ({ children }) => {
  const navigate = useNavigate();

  const isActive = (route) =>
    location.pathname === route || location.pathname.startsWith(route + "/");

  const location = useLocation();
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
      RoutesString.routeDetail,
      RoutesString.navigation,
      RoutesString.chatbot,
    ].includes(location.pathname) ||
    location.pathname.startsWith("/route/") ||
    location.pathname.startsWith("/chat/");

  const topBarHeight = 64;
  const navBarHeight = 56;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: noDesign ? "0px" : `${topBarHeight}px`,
          paddingBottom: noDesign ? "0px" : `${navBarHeight}px`,
        }}
      >
        {children}
      </Box>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          backgroundColor: theme.palette.kompitrail.card,
          color: theme.palette.text.primary,
          boxShadow: "none",
          top: "auto",
          bottom: 0,
          display: noDesign ? "none" : "flex",
        })}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            onClick={() => navigate(RoutesString.home)}
            sx={{
              color: "inherit",
              opacity: isActive(RoutesString.home) ? 1 : 0.45,
            }}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(RoutesString.chat)}
            sx={{
              color: "inherit",
              opacity: isActive(RoutesString.chat) ? 1 : 0.45,
            }}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(RoutesString.profile)}
            sx={{
              color: "inherit",
              opacity: isActive(RoutesString.profile) ? 1 : 0.45,
            }}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
