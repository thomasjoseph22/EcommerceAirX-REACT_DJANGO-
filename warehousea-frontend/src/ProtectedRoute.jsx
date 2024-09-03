// src/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx'; // Adjust the path as needed

const ProtectedRoute = ({ element: Component }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Component /> : <Navigate to="/customer/login" />;
};

export default ProtectedRoute;
