import React, { Children, createContext, useState } from 'react'
import { getLocalStorage } from '../src/helpers/localStorageUtils';

export const KompitrailContext = createContext();

export const KompitrailProvider = ({Children}) => {
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
      {Children}
    </KompitrailContext.Provider> 
  )
} 
