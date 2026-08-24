import { Link, NavLink, Outlet } from 'react-router-dom';
import { Film, Clapperboard, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui';
import { PATHS } from '@/routes/paths';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-bg text-fg-1 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-surface border-b lg:border-b-0 lg:border-r border-border p-4 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <Logo size="sm" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </div>
          </div>
          <nav className="space-y-1">
            <NavLink
              to={PATHS.ADMIN_MOVIES}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-fg-2 hover:bg-white/5 hover:text-fg'
                }`
              }
            >
              <Film className="w-4 h-4" /> Quản Lý Phim
            </NavLink>
            <NavLink
              to={PATHS.ADMIN_GENRES}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-fg-2 hover:bg-white/5 hover:text-fg'
                }`
              }
            >
              <Clapperboard className="w-4 h-4" /> Thể Loại
            </NavLink>
            <NavLink
              to={PATHS.ADMIN_ARTISTS}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-fg-2 hover:bg-white/5 hover:text-fg'
                }`
              }
            >
              <Users className="w-4 h-4" /> Nghệ Sĩ / Diễn Viên
            </NavLink>
          </nav>
        </div>
        <div className="pt-4 border-t border-border mt-6">
          <Link
            to={PATHS.HOME}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-fg-3 hover:text-fg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Về Trang Chủ NovaPlay
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
