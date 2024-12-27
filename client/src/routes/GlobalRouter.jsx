import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { RoutesString } from "./routes";
import { Home } from "../pages/Home/Home";
import { Search } from "../pages/Search/Search";
import { Profile } from "../pages/Profile/Profile";
import { Register } from "../pages/auth/Register/Register";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { Login } from "../pages/auth/Login/Login";
import { TopBar } from "../components/TopBarApp/TopBarApp";
import { Chat } from "../pages/Chat/Chat";
import { InfoUser } from "../pages/InfoUser/InfoUser";
import { CreateTrip } from "../pages/CreateTrip/CreateTrip";
import { EditUser } from "../pages/InfoUser/EditUser/EditUser";
import { Motorbike } from "../pages/InfoUser/Motorbike/Motorbike";
import { Settings } from "../pages/InfoUser/Settings/Settings";
import { EditPassword } from "../pages/InfoUser/Settings/EditPassword/EditPassword";
import { KompitrailContext } from "../../context/KompitrailContext";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const GlobalRouter = () => {
  const { user, token, isLoading } = useContext(KompitrailContext);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      {token && user && <TopBar />}
      {token && user && (
        <NavBarApp>
          <Routes>
            {/* Redirect any unknown route to / */}
            <Route path="*" element={<Navigate to={RoutesString.home} />} />
            <Route path={RoutesString.home} element={<Home />} />
            <Route path={RoutesString.search} element={<Search />} />
            <Route path={RoutesString.createtrip} element={<CreateTrip />} />
            <Route path={RoutesString.chat} element={<Chat />} />
            <Route path={RoutesString.profile} element={<Profile />} />
            <Route path={RoutesString.infouser} element={<InfoUser />} />
            <Route path={RoutesString.editUser} element={<EditUser />} />
            <Route path={RoutesString.motorbike} element={<Motorbike />} />
            <Route path={RoutesString.settings} element={<Settings />} />
            <Route
              path={RoutesString.editPassword}
              element={<EditPassword />}
            />
          </Routes>
        </NavBarApp>
      )}
      {(!token || !user) && (
        <Routes>
          {/* Redirect any unknown route to /landing */}
          <Route path="*" element={<Navigate to={RoutesString.landing} />} />
          <Route path={RoutesString.landing} element={<LandingPage />} />
          <Route path={RoutesString.register} element={<Register />} />
          <Route path={RoutesString.login} element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
