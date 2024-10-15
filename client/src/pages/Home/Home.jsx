import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [first, setFirst] = useState();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: "70px" }}>
      <button onClick={() => navigate("/")}>Go to Landing</button>
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
          repudiandae architecto minus pariatur laborum distinctio nostrum
          deserunt! Aperiam, voluptates? Esse officiis cumque iste et deserunt.
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, iure!
        </p>
        <button onClick={() => navigate("/")}>Go to Landing</button>
      </div>
    </div>
  );
};
