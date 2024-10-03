import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_CACHE_USER);
    const storedMenu = localStorage.getItem(process.env.REACT_APP_CACHE_MENU);
    const storedToken = localStorage.getItem(process.env.REACT_APP_TOKEN_USER);
    if (storedUser && storedMenu && storedToken) {
      setUser(JSON.parse(storedUser));
      setMenu(JSON.parse(storedMenu));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, menuData, tokenData) => {
    setUser(userData);
    setMenu(menuData);
    setToken(tokenData);
    localStorage.setItem(process.env.REACT_APP_CACHE_USER, JSON.stringify(userData));
    localStorage.setItem(process.env.REACT_APP_CACHE_MENU, JSON.stringify(menuData)); 
    localStorage.setItem(process.env.REACT_APP_TOKEN_USER, tokenData); 
  };

  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_CACHE_USER);
    localStorage.removeItem(process.env.REACT_APP_CACHE_MENU);
    localStorage.removeItem(process.env.REACT_APP_TOKEN_USER);
    setUser(null);
    setMenu(null);
  };

  return (
    <AuthContext.Provider value={{ user, menu, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
