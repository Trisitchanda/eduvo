import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import PublicDemoRequestPage from './pages/PublicDemoRequestPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DemoRequestsPage from './pages/DemoRequestsPage';
import DemoRequestDetailsPage from './pages/DemoRequestDetailsPage';

function IndexRedirect() {
  const { user } = useAuth();
  if (user?.role === 'SALES_EXECUTIVE') {
    return <Navigate to="requests" replace />;
  }
  return <Navigate to="dashboard" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicDemoRequestPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<IndexRedirect />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="requests" element={<DemoRequestsPage />} />
            <Route path="requests/:id" element={<DemoRequestDetailsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
