
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-finly-primary">404</h1>
      <p className="text-2xl mt-4 mb-6">Page not found</p>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
