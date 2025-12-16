import React, { createContext, useContext } from "react";

export const SocketContext = createContext();
// Helpful for debugging with ReactDev Tools
SocketContext.displayName = "SocketContext";

export const SocketProvider = ({ children }) => {
  return <div>SocketContext</div>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return ctx;
};
