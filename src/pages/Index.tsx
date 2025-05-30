
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    // If authenticated, redirect to the appropriate dashboard
    if (user?.role === 'client') {
      return <Navigate to="/my-loans" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
