import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// Utils
import { getLocalStorage } from "../helpers/localStorageUtils";
import { USERS_URL } from "../api";

export const KompitrailContext = createContext();

export const KompitrailProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tokenLocalStorage = getLocalStorage("token");

  useEffect(() => {
    setToken(tokenLocalStorage);

    // No token → user is logged out
    if (!tokenLocalStorage) {
      setUser(null);
      setIsLoading(false);
      setIsLogged(false);
      return;
    }

    let decodedToken;

    try {
      decodedToken = jwtDecode(tokenLocalStorage);
    } catch (error) {
      console.error("Invalid JWT token", error);
      setUser(null);
      setIsLoading(false);
      setIsLogged(false);
      setToken(undefined);
      return;
    }

    // Extract user_id from decoded token payload
    const user_id = decodedToken?.user?.user_id;

    // If user_id is missing, treat as invalid auth state
    if (!user_id) {
      console.error("Decoded token does not contain user_id:", decodedToken);
      setUser(null);
      setIsLogged(false);
      setIsLoading(false);
      setToken(undefined);
      return;
    }

    // Fetch data
    axios
      .get(`${USERS_URL}/oneuser/${user_id}`)
      .then((res) => {
        setUser(res.data);
        setIsLogged(true);
      })
      .catch((err) => {
        console.error("Error fetching user from /oneuser:", err);
        setUser(null);
        setIsLogged(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
