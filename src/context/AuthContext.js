import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_CACHE_USER);
    const storedMenu = localStorage.getItem(process.env.REACT_APP_CACHE_MENU);
    if (storedUser && storedMenu) {
      setUser(JSON.parse(storedUser));
      setMenu(JSON.parse(storedMenu));
    }
  }, []);

  const login = (userData, menuData) => {
    setUser(userData);
    setMenu(menuData);
    localStorage.setItem(process.env.REACT_APP_CACHE_USER, JSON.stringify(userData));
    localStorage.setItem(process.env.REACT_APP_CACHE_MENU, JSON.stringify(menuData)); 
  };

  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_CACHE_USER);
    localStorage.removeItem(process.env.REACT_APP_CACHE_MENU);
    setUser(null);
    setMenu(null);
  };

  return (
    <AuthContext.Provider value={{ user, menu, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
