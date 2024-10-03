import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { RoutesString } from "./routes";
import { Home } from "../pages/Home/Home";
import { Search } from "../pages/Search/Search";
import { Profile } from "../pages/Profile/Profile";


export const GlobalRouter = () => {
  return (
    <BrowserRouter>
      <NavBarApp>
        <Routes>
          <Route path={RoutesString.home} element={<Home />} />
          <Route path={RoutesString.search} element={<Search />} />
          <Route path={RoutesString.profile} element={<Profile />} />
        </Routes>
      </NavBarApp>
    </BrowserRouter>
  )
}