import React from "react";

import { Link } from "react-router-dom";

export const NavBarApp = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/search">Buscar</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
};

//Structure for the future
// const theme = useTheme();
// const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md')); // Cambia a iconos en móviles y tablets

// return (
//   <AppBar position="static">
//     <Toolbar>
//       {/* Mostramos texto en pantallas grandes, iconos en móviles y tablets */}
//       <IconButton edge="start" color="inherit" aria-label="home">
//         {!isMobileOrTablet ?
//           <Typography variant="body1" sx={{ ml: 1 }}>Home</Typography>
//           : <HomeIcon />
//         }
//       </IconButton>
