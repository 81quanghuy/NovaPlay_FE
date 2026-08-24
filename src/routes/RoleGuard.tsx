import { Navigate, Outlet } from 'react-router-dom';
import { hasAnyRole, useAuthStore } from '@/store/authStore';
import type { RoleName } from '@/lib/api/types';
import { PATHS } from './paths';

interface Props {
  allow: RoleName[];
}

export function RoleGuard({ allow }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!hasAnyRole(user, allow)) return <Navigate to={PATHS.FORBIDDEN} replace />;
  return <Outlet />;
}
