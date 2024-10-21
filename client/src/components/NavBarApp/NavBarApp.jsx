import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import { RoutesString } from "../../routes/routes";

export const NavBarApp = ({ children }) => {
  const [activeButton, setActiveButton] = useState(RoutesString.home);
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    setActiveButton(path);
    navigate(path);
  };

  const topBarHeight = 64;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: `${topBarHeight}px`,
          paddingBottom: "56px",
        }}
      >
        {children}
      </Box>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            onClick={() => handleButtonClick(RoutesString.home)}
            color={activeButton === RoutesString.home ? "" : "inherit"}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={() => handleButtonClick(RoutesString.search)}
            color={activeButton === RoutesString.search ? "" : "inherit"}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => handleButtonClick(RoutesString.createtrip)}
            color={activeButton === RoutesString.createtrip ? "" : "inherit"} //Change the path
          >
            <AddIcon sx={{ fontSize: 50 }} />
          </IconButton>
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
