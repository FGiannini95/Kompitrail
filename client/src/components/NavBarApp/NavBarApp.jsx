import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppBar, Box, Toolbar, IconButton } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";

import { RoutesString } from "../../routes/routes";

export const NavBarApp = ({ children }) => {
  const navigate = useNavigate();

  const isActive = (route) =>
    location.pathname === route || location.pathname.startsWith(route + "/");

  const location = useLocation();

  const noDesign = [
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
  ].includes(location.pathname);

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
        sx={{
          backgroundColor: "#eeeeee",
          color: "black",
          boxShadow: "none",
          top: "auto",
          bottom: 0,
          display: noDesign ? "none" : "flex",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            onClick={() => navigate(RoutesString.home)}
            color={isActive(RoutesString.home) ? "" : "inherit"}
          >
            <HomeIcon />
          </IconButton>
          {/* <IconButton
            onClick={() => handleButtonClick(RoutesString.search)}
            color={activeButton === RoutesString.search ? "" : "inherit"}
          >
            <SearchIcon />
          </IconButton> */}
          {/* <IconButton
            onClick={() => handleButtonClick(RoutesString.createTrip)}
            color={activeButton === RoutesString.createTrip ? "" : "inherit"}
          >
            <AddIcon sx={{ fontSize: 50 }} />
          </IconButton> */}
          <IconButton
            onClick={() => navigate(RoutesString.chat)}
            color={isActive(RoutesString.chat) ? "" : "inherit"}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(RoutesString.profile)}
            color={isActive(RoutesString.profile) ? "" : "inherit"}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
