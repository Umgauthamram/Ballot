import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AppProvider } from './store';
import Layout from './Layout/layout';
import Landing from './pages/Landing';
import Login from './components/Login';
import Signup from './components/signup';
import NotFound from './pages/NotFound';

import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/settings';

import ProtectedRoute from './protectedRoute';

const App = () => {
  return (
    <AppProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0px',
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            fontSize: '12px'
          },
        }}
      />
      
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;