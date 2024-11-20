import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { RoutesString } from "./routes";
import { Home } from "../pages/Home/Home";
import { Search } from "../pages/Search/Search";
import { Profile } from "../pages/Profile/Profile";
import { Register } from "../pages/auth/Register/Register";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { Login } from "../pages/auth/Login/Login";
import TopBar from "../components/TopBarApp/TopBarApp";
import { Chat } from "../pages/Chat/Chat";
import { InfoUser } from "../pages/InfoUser/InfoUser";
import { CreateTrip } from "../pages/CreateTrip/CreateTrip";
import { KompitrailContext } from "../../context/KompitrailContext";
import { EditUser } from "../pages/EditUser/EditUser";
import { Motorbike } from "../pages/InfoUser/Motorbike/Motorbike";

export const GlobalRouter = () => {
  const { user, token } = useContext(KompitrailContext);

  return (
    <BrowserRouter>
      {token && user && <TopBar />}
      {token && user && (
        <NavBarApp>
          <Routes>
            <Route path={RoutesString.home} element={<Home />} />
            <Route path={RoutesString.search} element={<Search />} />
            <Route path={RoutesString.createtrip} element={<CreateTrip />} />
            <Route path={RoutesString.chat} element={<Chat />} />
            <Route path={RoutesString.profile} element={<Profile />} />
            <Route path={RoutesString.infouser} element={<InfoUser />} />
            <Route path={RoutesString.editUser} element={<EditUser />} />
            <Route path={RoutesString.motorbike} element={<Motorbike />} />
          </Routes>
        </NavBarApp>
      )}
      {(!token || !user) && (
        <Routes>
          <Route path={RoutesString.landing} element={<LandingPage />} />
          <Route path={RoutesString.register} element={<Register />} />
          <Route path={RoutesString.login} element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
