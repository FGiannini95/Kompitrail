import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppBar, Box, Toolbar, IconButton } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from "@mui/icons-material/Add";

import { RoutesString } from "../../routes/routes";

export const NavBarApp = ({ children }) => {
  const [activeButton, setActiveButton] = useState(RoutesString.home);
  const navigate = useNavigate();

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
  ].includes(location.pathname);

  const handleButtonClick = (path) => {
    setActiveButton(path);
    navigate(path);
  };

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
            onClick={() => handleButtonClick(RoutesString.home)}
            color={activeButton === RoutesString.home ? "" : "inherit"}
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
            onClick={() => handleButtonClick(RoutesString.chat)}
            color={activeButton === RoutesString.chat ? "" : "inherit"}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            onClick={() => handleButtonClick(RoutesString.profile)}
            color={activeButton === RoutesString.profile ? "" : "inherit"}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
