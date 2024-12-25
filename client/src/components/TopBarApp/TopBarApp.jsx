import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SportsMotorsportsOutlinedIcon from "@mui/icons-material/SportsMotorsportsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { RoutesString } from "../../routes/routes";
import { KompitrailContext } from "../../../context/KompitrailContext";
import { capitalizeFirstLetter } from "../../helpers/utils";

const TopBar = () => {
  // We use this hook to acced to the current location
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(KompitrailContext);

  const [animateIcon, setAnimateIcon] = useState(false);

  const noDesign = [
    RoutesString.infouser,
    RoutesString.editUser,
    RoutesString.motorbike,
    RoutesString.settings,
    RoutesString.editPassword,
  ].includes(location.pathname);

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
            <Typography variant="h6">
              {capitalizeFirstLetter(user.name)}
            </Typography>
            <SportsMotorsportsOutlinedIcon
              sx={{
                transition: "transform 0.5s ease-in-out",
                transform: animateIcon ? "rotate(360deg)" : "none",
              }}
            />
          </Box>
        );
      case `${RoutesString.search}`:
        return <Typography variant="h6">Buscar</Typography>;
      case `${RoutesString.createtrip}`:
        return <Typography variant="h6">Crear ruta</Typography>;
      case `${RoutesString.chat}`:
        return <Typography variant="h6">Chat</Typography>;
      case `${RoutesString.profile}`:
        return <Typography variant="h6">Perfil</Typography>;
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
      style={{
        color: "black",
        boxShadow: "none",
        backgroundColor: "#eeeeee",
        height: noDesign ? "0px" : "64px",
        display: noDesign ? "none" : "flex",
        justifyContent: "center",
      }}
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

export default TopBar;
