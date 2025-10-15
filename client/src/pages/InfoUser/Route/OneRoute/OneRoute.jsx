import React from "react";
import { useParams } from "react-router-dom";

export const OneRoute = () => {
  const { id } = useParams();
  return (
    <>
      <h1>ROUTE Details</h1>
      <p>Route ID: {id}</p>
    </>
  );
};
