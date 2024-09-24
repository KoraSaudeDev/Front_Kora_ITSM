import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); 
  const location = useLocation(); 

  return user ? element : <Navigate to="/loginRPD" state={{ from: location }} />;
};

export default ProtectedRoute;
