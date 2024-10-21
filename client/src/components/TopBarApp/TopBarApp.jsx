import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import MenuIcon from "@mui/icons-material/Menu";
import { RoutesString } from "../../routes/routes";

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [animateIcon, setAnimateIcon] = useState(false);

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

  //TODO: after the onClick we have to navigate to the info profile view
  const handleIconMenuClick = () => {
    navigate(RoutesString.createtrip);
  };

  const leftSideComponent = () => {
    switch (location.pathname) {
      case `${RoutesString.home}`:
        return (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="10px"
          >
            {/* TODO: the value in the Typography must be dinamic and has to come from the context */}
            <Typography variant="h6">Hola Federico</Typography>
            <SportsMotorsportsIcon
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
        backgroundColor: "#1976d2",
        height: "64px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          {leftSideComponent()}
          {rightSideComponent()}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
