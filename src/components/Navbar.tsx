import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, KeyRound, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Logo } from '@/features/auth/components/Logo';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const initial = (user?.username?.[0] || 'N').toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 bg-bg-2/85 backdrop-blur-md border-b border-border">
      <div className="max-w-container mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center">
          <Logo size="sm" />
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 bg-white/5 border border-border rounded-pill px-2 h-9 hover:bg-white/10 transition-colors"
          >
            <span className="w-7 h-7 rounded-pill bg-grad-brand grid place-items-center font-display font-bold text-white text-sm">
              {initial}
            </span>
            <span className="text-sm font-semibold text-fg-1 pr-1">
              {user?.username || 'Thành viên'}
            </span>
            <ChevronDown className="w-4 h-4 text-fg-2" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-2 border border-border rounded-md shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-fg-1 truncate">{user?.username}</p>
                <p className="text-xs text-fg-3 truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/change-password');
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-fg-1 hover:bg-white/5 inline-flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-fg-2" /> Đổi mật khẩu
              </button>
              <button
                type="button"
                onClick={logout}
                disabled={isLoading}
                className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 inline-flex items-center gap-2 disabled:opacity-60"
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
