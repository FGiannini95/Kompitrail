import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import MenuIcon from "@mui/icons-material/Menu";
import { RoutesString } from "../../routes/routes";

const TopBar = () => {
  // This hook give as access to the current location object
  const location = useLocation();

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
            <Typography variant="h6">Hola Federico</Typography>
            <SportsMotorsportsIcon />
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
