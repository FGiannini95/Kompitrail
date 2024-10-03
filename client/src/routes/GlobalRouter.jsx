import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { RoutesString } from "./routes";
import { Home } from "../pages/Home/Home";
import { Search } from "../pages/Search/Search";
import { Profile } from "../pages/Profile/Profile";
import { Register } from "../pages/Register/Register";
import { LandingPage } from "../pages/LandingPage/LandingPage";


export const GlobalRouter = () => {
  return (
    <BrowserRouter>
      <NavBarApp>
        <Routes>
          <Route path={RoutesString.home} element={<Home />} />
          <Route path={RoutesString.search} element={<Search />} />
          <Route path={RoutesString.profile} element={<Profile />} />
          <Route path={RoutesString.landing} element={<LandingPage />} />
          <Route path={RoutesString.register} element={<Register />} />
        </Routes>
      </NavBarApp>
    </BrowserRouter>
  )
}