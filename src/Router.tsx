import { FC, JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RoutePaths } from './constants';
import { isAuthenticated } from './middlewares';
import { LoginPage } from './modules/auth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  if (isAuthenticated()) {
    return <Navigate to={RoutePaths.DASHBOARD} replace />;
  }
  return children;
};

export const Router: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RoutePaths.LOGIN} replace />} />

      {/* Public Routes */}
      <Route
        path={RoutePaths.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path={RoutePaths.DASHBOARD}
        element={
          <ProtectedRoute>
            <div>Dashboard Page (Protected)</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
