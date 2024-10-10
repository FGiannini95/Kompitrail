import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [first, setFirst] = useState();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: "20px" }}>
      <button onClick={() => navigate("landing")}>Go to Landing</button>
    </div>
  );
};
