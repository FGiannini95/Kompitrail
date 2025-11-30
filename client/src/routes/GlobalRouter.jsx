import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBarApp } from "../components/NavBarApp/NavBarApp";
import { RoutesString } from "./routes";
import { Home } from "../pages/Home/Home";
import { Search } from "../pages/Search/Search";
import { Profile } from "../pages/Profile/Profile";
import { Register } from "../auth/Register/Register";
import { LandingPage } from "../auth/LandingPage/LandingPage";
import { Login } from "../auth/Login/Login";
import { TopBar } from "../components/TopBarApp/TopBarApp";
import { Chat } from "../pages/Chat/Chat";
import { InfoUser } from "../pages/InfoUser/InfoUser";
import { EditUser } from "../pages/InfoUser/EditUser/EditUser";
import { Motorbike } from "../pages/InfoUser/Motorbike/Motorbike";
import { Settings } from "../pages/InfoUser/Settings/Settings";
import { EditPassword } from "../pages/InfoUser/Settings/EditPassword/EditPassword";
import { KompitrailContext } from "../context/KompitrailContext";
import { MyRoute } from "../pages/InfoUser/Route/MyRoute";
import { OneRoute } from "../pages/InfoUser/Route/OneRoute/OneRoute";
import { Loading } from "../components/Loading/Loading";

import { ConfirmationDialogProvider } from "../context/ConfirmationDialogContext/ConfirmationDialogContext";
import { SnackbarProvider } from "../context/SnackbarContext/SnackbarContext";
import { MotorbikesProvider } from "../context/MotorbikesContext/MotorbikesContext";
import { RoutesProvider } from "../context/RoutesContext/RoutesContext";
import { ScrollToTop } from "../components/ScrollToTop/ScrollToTop";
import { CaptureAndForward } from "../auth/CaptureAndForward/CaptureAndForward";
import { ChatRoom } from "../pages/Chat/ChatRoom/ChatRoom";
import { Box } from "@mui/material";

export const GlobalRouter = ({ toggleMode, mode }) => {
  const { user, token, isLoading } = useContext(KompitrailContext);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          bgcolor:
            theme.palette.kompitrail?.page || theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
        })}
      >
        {token && user && <TopBar />}
        {token && user && (
          <ConfirmationDialogProvider>
            <SnackbarProvider>
              <MotorbikesProvider>
                <RoutesProvider>
                  <NavBarApp>
                    <Routes>
                      {/* Redirect any unknown route to / */}
                      <Route
                        path="*"
                        element={<Navigate to={RoutesString.home} />}
                      />
                      <Route path={RoutesString.home} element={<Home />} />
                      <Route path={RoutesString.search} element={<Search />} />
                      <Route path={RoutesString.chat} element={<Chat />} />
                      <Route
                        path={RoutesString.chatDetail}
                        element={<ChatRoom />}
                      />
                      <Route
                        path={RoutesString.otherProfile}
                        element={<Profile />}
                      />
                      <Route
                        path={RoutesString.profile}
                        element={<Profile />}
                      />
                      <Route
                        path={RoutesString.infouser}
                        element={<InfoUser />}
                      />
                      <Route
                        path={RoutesString.editUser}
                        element={<EditUser />}
                      />
                      <Route
                        path={RoutesString.motorbike}
                        element={<Motorbike />}
                      />
                      <Route
                        path={RoutesString.settings}
                        element={
                          <Settings toggleMode={toggleMode} mode={mode} />
                        }
                      />
                      <Route path={RoutesString.route} element={<MyRoute />} />
                      <Route
                        path={RoutesString.routeDetail}
                        element={<OneRoute />}
                      />
                      <Route
                        path={RoutesString.editPassword}
                        element={<EditPassword />}
                      />
                    </Routes>
                  </NavBarApp>
                </RoutesProvider>
              </MotorbikesProvider>
            </SnackbarProvider>
          </ConfirmationDialogProvider>
        )}
        {(!token || !user) && (
          <Routes>
            {/* Explicit public routes */}
            <Route path={RoutesString.landing} element={<LandingPage />} />
            <Route path={RoutesString.register} element={<Register />} />
            <Route path={RoutesString.login} element={<Login />} />
            {/* Catch-all: capture & forward to /landing with redirect */}
            <Route path="*" element={<CaptureAndForward />} />
          </Routes>
        )}
      </Box>
    </BrowserRouter>
  );
};
