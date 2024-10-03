import React, { children, createContext, useState, useEffect } from 'react'
import { getLocalStorage } from '../src/helpers/localStorageUtils';

export const KompitrailContext = createContext();

export const KompitrailProvider = ({children}) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [isLogged, setIsLogged] = useState(false);
  const tokenLocalSotrage = getLocalStorage("token");

  useEffect(() => {
   setToken(tokenLocalSotrage);
  }, [token])
  
  return (
    <KompitrailContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      isLogged,
      setIsLogged
    }}>
      {children}
    </KompitrailContext.Provider> 
  )
} 
