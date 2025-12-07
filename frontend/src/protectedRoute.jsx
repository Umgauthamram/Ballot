import React from 'react';
import { useApp } from './store';
import Landing from './pages/Landing';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Landing />;
  }

  const userRole = currentUser.isAdmin ? 'ADMIN' : 'STUDENT';

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return userRole === 'ADMIN' ? <AdminPanel /> : <StudentDashboard />;
  }

  return children;
};

export default ProtectedRoute;