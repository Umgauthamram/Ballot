import React from 'react';
import  Button  from '../ui/button';
import { useApp } from '../store';

const NotFound = () => {
  const { currentUser, setView } = useApp();

  const goHome = () => {
    if (currentUser?.isAdmin) setView('ADMIN_PANEL');
    else if (currentUser) setView('STUDENT_DASHBOARD');
    else setView('LANDING');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 bg-black">
      <h1 className="text-8xl font-bold uppercase mb-8 text-red-600 animate-pulse">
        403
      </h1>
      <h2 className="text-4xl font-bold uppercase mb-6 text-white">
        Access Restricted
      </h2>
      <p className="text-lg text-gray-400 uppercase tracking-widest mb-12 max-w-md">
        You do not have clearance for this sector.
      </p>
      <Button onClick={goHome} size="lg" className="px-12">
        Return to Base
      </Button>
    </div>
  );
};

export default NotFound;