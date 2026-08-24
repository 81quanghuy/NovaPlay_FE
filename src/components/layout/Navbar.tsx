import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Bookmark,
  ChevronDown,
  Crown,
  Dices,
  Flame,
  Globe,
  KeyRound,
  LogOut,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { hasRole } from '@/features/auth/utils/authUtils';
import { Logo } from '@/components/ui';
import { NAV_LINKS, NAV_GENRES, NAV_COUNTRIES } from '@/config';
import { PATHS } from '@/routes/paths';
import { SpotlightSearchModal } from './SpotlightSearchModal';
import { CinemaMoodMatcher } from '@/features/movies/components/CinemaMoodMatcher';
import { NotificationDrawer } from '@/features/notifications/components/NotificationDrawer';
import { useNotificationStore } from '@/features/notifications/store/notificationStore';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
  const { logout, isLoading: logoutLoading } = useLogout();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [moodMatcherOpen, setMoodMatcherOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userMenuRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Global Cmd+K / Ctrl+K listener for Spotlight Search
  useEffect(() => {
    function onGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotlightOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  // Scroll effect
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 20);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Click-outside closes user menu
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function handleNotificationClick() {
    if (isAuthenticated) {
      setNotificationDrawerOpen(true);
    } else {
      navigate(PATHS.LOGIN);
    }
  }

  const initial = (user?.username?.[0] || 'N').toUpperCase();

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 h-16 transition-all duration-base ${
          scrolled
            ? 'bg-bg-2/95 backdrop-blur-md border-b border-border shadow-md'
            : 'bg-gradient-to-b from-bg/90 via-bg/40 to-transparent'
        }`}
      >
        <div className="max-w-container mx-auto h-full px-4 lg:px-8 flex items-center gap-4">
          {/* Logo */}
          <Link to={PATHS.HOME} className="inline-flex items-center flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Nav links — desktop */}
          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-1 ml-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-fast ${
                    isActive ? 'text-primary bg-primary/10' : 'text-fg-2 hover:text-fg hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Link Gói VIP */}
            <NavLink
              to={PATHS.PRICING}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-fast flex items-center gap-1 ${
                  isActive ? 'text-gold bg-gold/10' : 'text-fg-2 hover:text-gold hover:bg-white/5'
                }`
              }
            >
              <Crown className="w-3.5 h-3.5 text-gold" />
              <span>Gói VIP</span>
            </NavLink>

            {/* Dropdown thể loại */}
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-fg-2 hover:text-fg hover:bg-white/5 transition-colors duration-fast"
              >
                Thể Loại <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-surface-2 border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-fast p-1.5 grid grid-cols-2 gap-1 z-50">
                {NAV_GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => navigate(`${PATHS.MOVIES}?genre=${encodeURIComponent(genre)}`)}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg text-fg-2 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown quốc gia */}
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-fg-2 hover:text-fg hover:bg-white/5 transition-colors duration-fast"
              >
                <Globe className="w-3.5 h-3.5" /> Quốc Gia <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-surface-2 border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-fast p-1.5 space-y-0.5 z-50">
                {NAV_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => navigate(`${PATHS.MOVIES}?country=${encodeURIComponent(country)}`)}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg text-fg-2 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    Phim {country}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex-1" />

          {/* Quick Mood Matcher Button "🎲 Xem Gì?" */}
          <button
            type="button"
            onClick={() => setMoodMatcherOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-pill bg-primary/15 border border-primary/40 text-primary text-xs font-bold hover:bg-primary hover:text-white shadow-glow transition-all active:scale-95"
          >
            <Dices className="w-4 h-4" />
            <span>Hôm Nay Xem Gì?</span>
          </button>

          {/* Spotlight Search Trigger (Cmd+K) */}
          <button
            type="button"
            onClick={() => setSpotlightOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-3 sm:px-3.5 rounded-pill bg-white/5 border border-border text-fg-2 hover:text-fg hover:border-primary/50 hover:bg-white/10 transition-all text-xs font-semibold shadow-inner"
          >
            <Search className="w-4 h-4 text-primary" />
            <span className="hidden md:inline">Tìm kiếm...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-fg-3">
              ⌘K
            </kbd>
          </button>

          {/* Notification bell — clickable */}
          <button
            type="button"
            onClick={handleNotificationClick}
            title={isAuthenticated ? 'Trung tâm thông báo' : 'Đăng nhập để xem thông báo'}
            aria-label="Trung tâm thông báo"
            className="grid w-9 h-9 place-items-center rounded-pill text-fg-2 hover:text-fg hover:bg-white/5 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {isAuthenticated && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-pill bg-primary shadow-glow animate-pulse" />
            )}
          </button>

          {/* User menu / login */}
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-2 bg-white/5 border border-border rounded-pill px-2 h-9 hover:bg-white/10 hover:border-primary/40 transition-colors"
              >
                <span className="w-7 h-7 rounded-pill bg-grad-brand grid place-items-center font-display font-bold text-white text-sm shadow-sm">
                  {initial}
                </span>
                <span className="hidden sm:block text-sm font-semibold text-fg-1 pr-1">
                  {user?.username || 'Thành viên'}
                </span>
                <ChevronDown className="w-4 h-4 text-fg-2" />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 bg-surface-2 border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                >
                  <div className="px-3.5 py-3 border-b border-border mb-1">
                    <p className="text-sm font-bold text-fg truncate">{user?.username}</p>
                    <p className="text-xs text-fg-3 truncate mb-2">{user?.email}</p>

                    {/* Daily Watching Streak Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold text-xs font-black">
                      <Flame className="w-3.5 h-3.5 fill-gold" />
                      <span>Chuỗi 3 ngày xem liên tiếp</span>
                    </div>
                  </div>

                  {/* Profile */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(PATHS.PROFILE);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-fg-1 hover:bg-white/5 hover:text-primary inline-flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-fg-3" />
                    <span>Hồ sơ cá nhân</span>
                  </button>

                  {/* My List */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(PATHS.MY_LIST);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-fg-1 hover:bg-white/5 hover:text-primary inline-flex items-center gap-2.5 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-fg-3" />
                    <span>Kho phim của tôi</span>
                  </button>

                  {/* VIP Pricing */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(PATHS.PRICING);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-gold hover:bg-gold/10 inline-flex items-center justify-between transition-colors"
                  >
                    <div className="inline-flex items-center gap-2.5">
                      <Crown className="w-4 h-4 text-gold" />
                      <span className="font-semibold">Gói cước VIP</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold/20 text-gold">
                      Nâng cấp
                    </span>
                  </button>

                  {/* Admin CMS Portal (ADMIN only) */}
                  {hasRole(user, 'ADMIN') && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate(PATHS.ADMIN_MOVIES);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-primary hover:bg-primary/10 inline-flex items-center justify-between transition-colors"
                    >
                      <div className="inline-flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Quản trị CMS</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        Admin
                      </span>
                    </button>
                  )}

                  <div className="border-t border-border my-1" />

                  {/* Change password */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(PATHS.CHANGE_PASSWORD);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-fg-1 hover:bg-white/5 hover:text-primary inline-flex items-center gap-2.5 transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-fg-3" />
                    <span>Đổi mật khẩu</span>
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    disabled={logoutLoading}
                    className="w-full text-left px-3.5 py-2 text-sm rounded-xl text-danger hover:bg-danger/10 inline-flex items-center gap-2.5 disabled:opacity-60 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={PATHS.LOGIN}
              className="inline-flex items-center justify-center h-9 px-5 rounded-pill bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-glow transition-all"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {/* Spotlight Search Modal (Cmd+K) */}
      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />

      {/* Cinema Mood Matcher Modal */}
      <CinemaMoodMatcher
        isOpen={moodMatcherOpen}
        onClose={() => setMoodMatcherOpen(false)}
      />

      {/* Notification Slide-over Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </>
  );
}
