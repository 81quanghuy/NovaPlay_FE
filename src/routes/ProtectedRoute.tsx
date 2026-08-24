import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PATHS } from './paths';

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status !== 'authenticated') {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
