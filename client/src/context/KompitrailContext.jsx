import React, { createContext, useState, useEffect } from "react";
import { getLocalStorage } from "../helpers/localStorageUtils";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { USERS_URL } from "../../../server/config/serverConfig";

export const KompitrailContext = createContext();

export const KompitrailProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    setToken(tokenLocalStorage);
    if (tokenLocalStorage) {
      const { user_id } = jwtDecode(tokenLocalStorage).user;
      axios
        .get(`${USERS_URL}/oneuser/${user_id}`)
        .then((res) => {
          setUser(res.data);
          setIsLogged(true);
        })
        .catch((err) => {
          console.error(err);
          setUser(null);
          setIsLogged(false);
        })
        .finally(() => {
          setIsLoading(false); // Pause loader if we get data
        });
    } else {
      setIsLoading(false); // Pause loader if we don't get any data
      setUser(null);
      setIsLogged(false);
    }
  }, []);

  return (
    <KompitrailContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isLogged,
        setIsLogged,
        isLoading,
      }}
    >
      {children}
    </KompitrailContext.Provider>
  );
};
