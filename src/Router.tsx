import { FC, JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RoutePaths } from './constants';
import { isAuthenticated } from './middlewares';
import { LoginPage, RegisterPage } from './modules/auth';
import { DashboardPage } from './modules/dashboard';
import { FieldManagementPage, FieldPage } from './modules/field';
import { OverviewPage } from './modules/overview';
import { CustomerManagementPage, StaffManagementPage } from './modules/user';

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
      {/* <Route path="/" element={<Navigate to={RoutePaths.LOGIN} replace />} /> */}

      {/* Public Routes */}
      <Route path="/" element={<FieldPage />} />
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
        <Route index element={<OverviewPage />} />

        {/* Sub routes */}
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.BOOKINGS} element={<div>Bookings Page</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.FIELDS} element={<FieldManagementPage />} />
        <Route
          path={RoutePaths.DASHBOARD_SUBPATHS.CUSTOMERS}
          element={<CustomerManagementPage />}
        />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.STAFFS} element={<StaffManagementPage />} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.REVENUE} element={<div>Revenue Page</div>} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.SETTINGS} element={<div>Settings Page</div>} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
