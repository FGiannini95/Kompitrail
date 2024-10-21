import React from "react";
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

export const GlobalRouter = () => {
  return (
    <BrowserRouter>
      <TopBar />
      <NavBarApp>
        <Routes>
          <Route path={RoutesString.home} element={<Home />} />
          <Route path={RoutesString.search} element={<Search />} />
          <Route path={RoutesString.createtrip} element={<CreateTrip />} />
          <Route path={RoutesString.chat} element={<Chat />} />
          <Route path={RoutesString.profile} element={<Profile />} />

          <Route path={RoutesString.landing} element={<LandingPage />} />
          <Route path={RoutesString.register} element={<Register />} />
          <Route path={RoutesString.login} element={<Login />} />
          <Route path={RoutesString.chat} element={<Chat />} />
          <Route path={RoutesString.infouser} element={<InfoUser />} />
        </Routes>
      </NavBarApp>
    </BrowserRouter>
  );
};
