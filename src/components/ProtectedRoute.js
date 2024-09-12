import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    element
  ) : (
    <Navigate to="/suporte/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
