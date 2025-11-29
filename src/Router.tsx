import { FC, JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RoutePaths, UserRole } from './constants';
import { getUserRole, isAuthenticated } from './middlewares';
import { LoginPage, RegisterPage } from './modules/auth';
import { BookingManagementPage } from './modules/booking/pages';
import { BookFieldPage, MyBookingsPage, MyProfilePage, VNPayPaymentPage } from './modules/customer';
import { DashboardPage, SettingsPage } from './modules/dashboard';
import { FieldManagementPage, FieldPage } from './modules/field';
import { OverviewPage } from './modules/overview';
import { RevenueManagementPage } from './modules/revenue';
import { CustomerManagementPage, StaffManagementPage } from './modules/user';

// Root Redirect - Redirects based on authentication and role
const RootRedirect = () => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  const role = getUserRole();
  if (role === UserRole.ADMIN || role === UserRole.STAFF) {
    return <Navigate to={RoutePaths.DASHBOARD} replace />;
  }

  // Customer role or default
  return <FieldPage />;
};

// Customer Route Guard - Only for CUSTOMER role
const CustomerRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  const role = getUserRole();
  if (role === UserRole.ADMIN || role === UserRole.STAFF) {
    return <Navigate to={RoutePaths.DASHBOARD} replace />;
  }

  return children;
};

// Admin Route Guard - Only for ADMIN and STAFF roles
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  const role = getUserRole();
  if (role === UserRole.CUSTOMER) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route - Redirect if authenticated based on role
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  if (isAuthenticated()) {
    const role = getUserRole();
    if (role === UserRole.ADMIN || role === UserRole.STAFF) {
      return <Navigate to={RoutePaths.DASHBOARD} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export const Router: FC = () => {
  return (
    <Routes>
      {/* Root Route - Role-based redirect */}
      <Route path="/" element={<RootRedirect />} />

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

      {/* Customer Protected Routes */}
      <Route
        path={RoutePaths.BOOK_FIELD}
        element={
          <CustomerRoute>
            <BookFieldPage />
          </CustomerRoute>
        }
      />
      <Route
        path={RoutePaths.MY_BOOKINGS}
        element={
          <CustomerRoute>
            <MyBookingsPage />
          </CustomerRoute>
        }
      />
      <Route
        path={RoutePaths.MY_PROFILE}
        element={
          <CustomerRoute>
            <MyProfilePage />
          </CustomerRoute>
        }
      />
      <Route
        path={RoutePaths.VNPAY_PAYMENT}
        element={
          <CustomerRoute>
            <VNPayPaymentPage />
          </CustomerRoute>
        }
      />

      {/* Admin/Staff Protected Routes */}
      <Route
        path={RoutePaths.DASHBOARD}
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.BOOKINGS} element={<BookingManagementPage />} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.FIELDS} element={<FieldManagementPage />} />
        <Route
          path={RoutePaths.DASHBOARD_SUBPATHS.CUSTOMERS}
          element={<CustomerManagementPage />}
        />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.STAFFS} element={<StaffManagementPage />} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.REVENUE} element={<RevenueManagementPage />} />
        <Route path={RoutePaths.DASHBOARD_SUBPATHS.SETTINGS} element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
