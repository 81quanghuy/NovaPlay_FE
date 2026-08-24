import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PATHS } from './paths';

export function PublicOnly() {
  const status = useAuthStore((s) => s.status);
  if (status === 'authenticated') return <Navigate to={PATHS.HOME} replace />;
  return <Outlet />;
}
