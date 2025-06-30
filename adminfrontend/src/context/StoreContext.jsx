// StoreContext.js
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false); // 👈

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin");

    if (savedToken) {
      setToken(savedToken);
    }
    if (isAdmin === "true") {
      setAdmin(true);
    }
  }, []);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    loginPopup,
    setLoginPopup, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
