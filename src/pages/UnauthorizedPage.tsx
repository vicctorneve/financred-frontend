
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <ShieldAlert className="h-16 w-16 text-finly-danger mb-4" />
      <h1 className="text-3xl font-bold text-finly-primary">Access Denied</h1>
      <p className="text-xl mt-4 mb-6">You don't have permission to access this page</p>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Please contact your administrator if you believe this is a mistake.
      </p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
