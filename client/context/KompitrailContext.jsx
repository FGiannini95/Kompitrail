import React, { createContext, useState, useEffect } from "react";
import { getLocalStorage } from "../src/helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const KompitrailContext = createContext();

export const KompitrailProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    setToken(tokenLocalStorage);
    if (tokenLocalStorage) {
      const { user_id } = jwtDecode(tokenLocalStorage).user;
      axios
        .get(`http://localhost:3000/users/oneuser/${user_id}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  return (
    <KompitrailContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isLogged,
        setIsLogged,
      }}
    >
      {children}
    </KompitrailContext.Provider>
  );
};
