import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { VerifyOtpPage } from '@/features/auth/pages/VerifyOtpPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { ChangePasswordPage } from '@/features/auth/pages/ChangePasswordPage';
import { HomePage } from '@/pages/HomePage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { AdminPage } from '@/pages/AdminPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { MoviesPage } from '@/features/movies/pages/MoviesPage';
import { MovieDetailPage } from '@/features/movies/pages/MovieDetailPage';
import { SearchPage } from '@/features/movies/pages/SearchPage';
import { WatchPage } from '@/features/movies/pages/WatchPage';
import { WatchlistPage } from '@/features/movies/pages/WatchlistPage';
import { AuthExpiredListener } from '@/components/feedback/AuthExpiredListener';
import { RouteErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { PublicOnly } from './PublicOnly';

export const router = createBrowserRouter([
  {
    element: <AuthExpiredListener />,
    errorElement: <RouteErrorBoundary />,
    children: [
      // ── Auth routes (chỉ khi chưa đăng nhập) ──────────────────────
      {
        element: <PublicOnly />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/login', element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/register', element: <RegisterPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/verify-otp', element: <VerifyOtpPage />, errorElement: <RouteErrorBoundary /> },
          {
            path: '/forgot-password',
            element: <ForgotPasswordPage />,
            errorElement: <RouteErrorBoundary />,
          },
          {
            path: '/reset-password',
            element: <ResetPasswordPage />,
            errorElement: <RouteErrorBoundary />,
          },
        ],
      },

      // ── Public routes với MainLayout (không cần đăng nhập) ────────
      {
        element: <MainLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/movies', element: <MoviesPage />, errorElement: <RouteErrorBoundary /> },
          {
            path: '/movie/:id',
            element: <MovieDetailPage />,
            errorElement: <RouteErrorBoundary />,
          },
          { path: '/search', element: <SearchPage />, errorElement: <RouteErrorBoundary /> },
        ],
      },

      // ── Protected routes ────────────────────────────────────────────────
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/', element: <HomePage />, errorElement: <RouteErrorBoundary /> },
          {
            path: '/change-password',
            element: <ChangePasswordPage />,
            errorElement: <RouteErrorBoundary />,
          },
          // Watchlist dùng MainLayout
          {
            element: <MainLayout />,
            errorElement: <RouteErrorBoundary />,
            children: [
              {
                path: '/watchlist',
                element: <WatchlistPage />,
                errorElement: <RouteErrorBoundary />,
              },
            ],
          },
          // WatchPage có header riêng — KHÔNG dùng MainLayout
          { path: '/watch/:id', element: <WatchPage />, errorElement: <RouteErrorBoundary /> },
          // Admin area
          {
            element: <RoleGuard allow={['ADMIN']} />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { path: '/admin', element: <AdminPage />, errorElement: <RouteErrorBoundary /> },
            ],
          },
        ],
      },

      // ── Special pages ─────────────────────────────────────────────
      { path: '/403', element: <ForbiddenPage />, errorElement: <RouteErrorBoundary /> },
      // Catch-all: thay vì redirect im lặng về /, hiện trang 404 thật
      { path: '*', element: <NotFoundPage />, errorElement: <RouteErrorBoundary /> },
    ],
  },
]);
