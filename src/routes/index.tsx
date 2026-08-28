import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthExpiredListener } from '@/components/feedback/AuthExpiredListener';
import { RouteErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { PublicOnly } from './PublicOnly';
import { PATHS } from './paths';

// Loading fallback component
function PageLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-pill border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-xs text-fg-3 font-medium">Đang tải nội dung...</span>
    </div>
  );
}

// Helper wrapper for Suspense
function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
}

// ── Lazy-loaded feature pages ──────────────────────────────────────────
// Auth
const LoginPage = React.lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = React.lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const VerifyOtpPage = React.lazy(() =>
  import('@/features/auth/pages/VerifyOtpPage').then((m) => ({ default: m.VerifyOtpPage })),
);
const ForgotPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const ChangePasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })),
);

// Core & Movies
const HomePage = React.lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const MoviesPage = React.lazy(() =>
  import('@/features/movies/pages/MoviesPage').then((m) => ({ default: m.MoviesPage })),
);
const MovieDetailPage = React.lazy(() =>
  import('@/features/movies/pages/MovieDetailPage').then((m) => ({ default: m.MovieDetailPage })),
);
const SearchPage = React.lazy(() =>
  import('@/features/movies/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const WatchPage = React.lazy(() =>
  import('@/features/movies/pages/WatchPage').then((m) => ({ default: m.WatchPage })),
);

// Feature Pages (Milestones 2–5)
const NotificationsPage = React.lazy(() =>
  import('@/features/notifications/pages/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
  })),
);
const PricingPage = React.lazy(() =>
  import('@/features/pricing/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
);
const MyListPage = React.lazy(() =>
  import('@/features/user/pages/MyListPage').then((m) => ({ default: m.MyListPage })),
);
const ProfilePage = React.lazy(() =>
  import('@/features/user/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const AdminLayout = React.lazy(() =>
  import('@/features/admin/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const AdminMoviesPage = React.lazy(() =>
  import('@/features/admin/pages/AdminMoviesPage').then((m) => ({ default: m.AdminMoviesPage })),
);
const AdminGenresPage = React.lazy(() =>
  import('@/features/admin/pages/AdminGenresPage').then((m) => ({ default: m.AdminGenresPage })),
);
const AdminArtistsPage = React.lazy(() =>
  import('@/features/admin/pages/AdminArtistsPage').then((m) => ({ default: m.AdminArtistsPage })),
);

// Special
const ForbiddenPage = React.lazy(() =>
  import('@/pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })),
);
const NotFoundPage = React.lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

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
          { path: PATHS.LOGIN, element: withSuspense(LoginPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.REGISTER, element: withSuspense(RegisterPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.VERIFY_OTP, element: withSuspense(VerifyOtpPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.FORGOT_PASSWORD, element: withSuspense(ForgotPasswordPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.RESET_PASSWORD, element: withSuspense(ResetPasswordPage), errorElement: <RouteErrorBoundary /> },
        ],
      },

      // ── Public routes với MainLayout (không cần đăng nhập) ────────
      {
        element: <MainLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: PATHS.MOVIES, element: withSuspense(MoviesPage), errorElement: <RouteErrorBoundary /> },
          { path: '/movie/:id', element: withSuspense(MovieDetailPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.SEARCH, element: withSuspense(SearchPage), errorElement: <RouteErrorBoundary /> },
          { path: PATHS.PRICING, element: withSuspense(PricingPage), errorElement: <RouteErrorBoundary /> },
        ],
      },

      // ── Protected routes (cần đăng nhập) ──────────────────────────
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: <MainLayout />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { path: PATHS.HOME, element: withSuspense(HomePage), errorElement: <RouteErrorBoundary /> },
              { path: PATHS.NOTIFICATIONS, element: withSuspense(NotificationsPage), errorElement: <RouteErrorBoundary /> },
              { path: PATHS.MY_LIST, element: withSuspense(MyListPage), errorElement: <RouteErrorBoundary /> },
              { path: '/watchlist', element: <Navigate to={PATHS.MY_LIST} replace /> },
              { path: PATHS.PROFILE, element: withSuspense(ProfilePage), errorElement: <RouteErrorBoundary /> },
              { path: PATHS.CHANGE_PASSWORD, element: withSuspense(ChangePasswordPage), errorElement: <RouteErrorBoundary /> },
            ],
          },

          // WatchPage có layout riêng (KHÔNG dùng MainLayout)
          { path: '/watch/:id', element: withSuspense(WatchPage), errorElement: <RouteErrorBoundary /> },

          // Admin area (yêu cầu vai trò ADMIN)
          {
            path: PATHS.ADMIN,
            element: <RoleGuard allow={['ADMIN']} />,
            errorElement: <RouteErrorBoundary />,
            children: [
              {
                element: withSuspense(AdminLayout),
                children: [
                  { index: true, element: <Navigate to={PATHS.ADMIN_MOVIES} replace /> },
                  { path: 'movies', element: withSuspense(AdminMoviesPage), errorElement: <RouteErrorBoundary /> },
                  { path: 'genres', element: withSuspense(AdminGenresPage), errorElement: <RouteErrorBoundary /> },
                  { path: 'artists', element: withSuspense(AdminArtistsPage), errorElement: <RouteErrorBoundary /> },
                ],
              },
            ],
          },
        ],
      },

      // ── Special pages ─────────────────────────────────────────────
      { path: PATHS.FORBIDDEN, element: withSuspense(ForbiddenPage), errorElement: <RouteErrorBoundary /> },
      { path: '*', element: withSuspense(NotFoundPage), errorElement: <RouteErrorBoundary /> },
    ],
  },
]);
