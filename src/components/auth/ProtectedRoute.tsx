// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Atau tampilkan spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
