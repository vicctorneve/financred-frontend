
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'any';
}

export const AppLayout = ({ children, requiredRole = 'any' }: AppLayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-finly-primary" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== 'any' && user?.role !== requiredRole.toUpperCase() && user?.role != "ROLE_ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
