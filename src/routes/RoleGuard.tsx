import { Navigate, Outlet } from 'react-router-dom';
import { hasAnyRole, useAuthStore } from '@/store/authStore';
import type { RoleName } from '@/lib/api/types';

interface Props {
  allow: RoleName[];
}

export function RoleGuard({ allow }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!hasAnyRole(user, allow)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
