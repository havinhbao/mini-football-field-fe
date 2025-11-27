import { FC, JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RoutePaths } from './constants';
import { isAuthenticated } from './middlewares';
import { LoginPage, RegisterPage } from './modules/auth';
import { DashboardPage } from './modules/dashboard';

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
      <Route
        path={RoutePaths.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path={RoutePaths.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        {/* Default page bên trong dashboard */}
        <Route index element={<div>Dashboard Home</div>} />

        {/* Sub routes */}
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.BOOKINGS} element={<div>Bookings Page</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.FIELDS} element={<div>Field Management</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.CUSTOMERS} element={<div>Customers Page</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.REVENUE} element={<div>Revenue Page</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.SETTINGS} element={<div>Settings Page</div>} />
      </Route>
    </Routes>
  );
};
