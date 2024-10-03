import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { user, menu, token } = useAuth(); 
  const location = useLocation(); 

  return user && menu && token ? element : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
