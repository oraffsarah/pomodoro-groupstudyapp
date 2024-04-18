import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Make sure the path to useUser is correct

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useUser(); // Destructure to get currentUser and loading state

  if (loading) {
    return <div>Loading...</div>; // Display loading message while checking auth state
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
