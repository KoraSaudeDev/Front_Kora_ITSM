import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(process.env.REACT_APP_CACHE_USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(process.env.REACT_APP_CACHE_USER, JSON.stringify(userData)); 
  };

  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_CACHE_USER);
    localStorage.removeItem(process.env.REACT_APP_TOKEN_USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
