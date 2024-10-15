import React from "react";
import { useNavigate } from "react-router-dom";
import { RoutesString } from "../../routes/routes";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Welcom to kompitrail</h1>
      <button onClick={() => navigate(RoutesString.register)}>Registro</button>
      <button onClick={() => navigate(RoutesString.login)}>Login</button>
    </div>
  );
};
