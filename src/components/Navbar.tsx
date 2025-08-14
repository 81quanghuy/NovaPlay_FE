import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, ChevronDown, Bell, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthPopup from './AuthPopup';
import { formatDisplayName, getInitials } from '../utils/formatName';

interface NavbarProps {
  isTransparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isTransparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const { user } = useAuth();
  const authTriggerRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Dropdown state (desktop)
  const [openDropdown, setOpenDropdown] = useState<null | 'genres' | 'countries'>(null);

  // Dropdown state (mobile)
  const [isMobileGenresOpen, setIsMobileGenresOpen] = useState(false);
  const [isMobileCountriesOpen, setIsMobileCountriesOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeNotiTab, setActiveNotiTab] = useState<'phim' | 'congdong'>('phim');

  // Mock data for dropdowns
  const genreItems: string[] = [
    'Hành động',
    'Hài',
    'Tâm lý',
    'Khoa học viễn tưởng',
    'Kinh dị',
    'Tình cảm',
    'Giật gân',
    'Hoạt hình',
  ];

  const countryItems: string[] = [
    'Việt Nam',
    'Mỹ',
    'Hàn Quốc',
    'Nhật Bản',
    'Trung Quốc',
    'Anh',
    'Pháp',
    'Ấn Độ',
    'Thái Lan',
  ];

  type NotificationItem = {
    id: number;
    title: string;
    message: string;
    time: string;
    category: 'phim' | 'congdong';
    isRead: boolean;
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Cập nhật phim', message: '"Kẻ Trộm Mặt Trăng 4" đã có bản Vietsub.', time: '2 phút trước', category: 'phim', isRead: false },
    { id: 2, title: 'Lịch chiếu', message: 'Tập mới của "Nhà Bác Học Điên" ra mắt tối nay.', time: '1 giờ trước', category: 'phim', isRead: true },
    { id: 3, title: 'Cộng đồng', message: 'Bạn có 2 bình luận mới.', time: 'Hôm nay', category: 'congdong', isRead: false },
  ]);

  const hasUnread = user ? notifications.some((n) => !n.isRead) : false;
  const visibleNotifications = user
    ? notifications.filter((n) => !n.isRead && n.category === activeNotiTab)
    : [];

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý tìm kiếm
    console.log('Searching for:', searchQuery);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAuthPopup = () => {
    setIsAuthPopupOpen(!isAuthPopupOpen);
  };

  // Close dropdowns/notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(target)) {
        setOpenDropdown(null);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: 'genres' | 'countries') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    if (!user) {
      setIsNotificationOpen(false);
    }
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${isTransparent && !isScrolled ? 'bg-transparent shadow-none' : 'bg-gray-800 shadow-lg'
      }`}>
      <div className="mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and Search */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-bold text-white">NovaPlay</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm phim, diễn viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 px-4 py-2 pl-10 bg-gray-700 text-sm text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-5 text-sm" ref={dropdownContainerRef}>
            <Link to="/topics" className="text-gray-300 hover:text-white transition-colors">
              Chủ đề
            </Link>

            {/* Genres Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('genres')}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Thể loại</span>
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'genres' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'genres' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg bg-gray-800 shadow-xl ring-1 ring-black/10 p-2 z-50">
                  <div className="grid grid-cols-1 gap-1">
                    {genreItems.map((name) => (
                      <button
                        type="button"
                        key={name}
                        className="w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-gray-700 hover:text-white"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/phim-grid" className="text-gray-300 hover:text-white transition-colors">
              Phim Lẻ
            </Link>
            <Link to="/series" className="text-gray-300 hover:text-white transition-colors">
              Phim Bộ
            </Link>

            {/* Countries Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('countries')}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Quốc gia</span>
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'countries' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'countries' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg bg-gray-800 shadow-xl ring-1 ring-black/10 p-2 z-50">
                  <div className="grid grid-cols-1 gap-1">
                    {countryItems.map((name) => (
                      <button
                        type="button"
                        key={name}
                        className="w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-gray-700 hover:text-white"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/actors" className="text-gray-300 hover:text-white transition-colors">
              Diễn Viên
            </Link>
          </div>

          {/* Notification + Auth Section */}
          <div className="hidden md:flex items-center ml-6 space-x-3">
            {/* Notification bell */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsNotificationOpen((v) => !v)}
                  aria-label="Thông báo"
                >
                  <Bell size={18} />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-96 rounded-xl bg-gray-800 shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden">
                    <div className="px-4 pt-3">
                      <div className="flex items-center">
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setActiveNotiTab('phim')}
                            className={`py-2 text-sm ${activeNotiTab === 'phim' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
                          >
                            Phim
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveNotiTab('congdong')}
                            className={`py-2 text-sm ${activeNotiTab === 'congdong' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
                          >
                            Cộng đồng
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60"
                          title="Đánh dấu tất cả là đã đọc"
                        >
                          <Check size={14} className="text-green-400" />
                          Đã đọc
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 mt-2" />
                    <div className="max-h-80 overflow-auto py-3">
                      {visibleNotifications.length === 0 ? (
                        <div className="px-4 py-10 text-center text-gray-300 text-sm">Không có thông báo nào</div>
                      ) : (
                        visibleNotifications.map((n) => (
                          <div key={n.id} className="px-4 py-3 hover:bg-gray-700/60 transition-colors">
                            <div className="text-sm text-white font-medium">{n.title}</div>
                            <div className="text-xs text-gray-300 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{n.time}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-gray-700" />
                    <div className="px-4 py-3">
                      <Link to="/notifications" className="block w-full text-center text-sm font-semibold text-gray-200 hover:text-white">Xem toàn bộ</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              ref={authTriggerRef}
              onClick={toggleAuthPopup}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(user.name, user.email)}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {formatDisplayName(user.name) || 'Người dùng'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-300" />
                  <span className="text-gray-300 text-sm font-medium">Thành viên</span>
                </div>
              )}
            </div>

            <AuthPopup
              isOpen={isAuthPopupOpen}
              onClose={() => setIsAuthPopupOpen(false)}
              triggerRef={authTriggerRef}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 px-2 pb-3 pt-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim, diễn viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-gray-700 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </form>

              {/* Mobile Menu Items */}
              <Link
                to="/topics"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Chủ đề
              </Link>

              {/* Mobile Genres Dropdown */}
              <div className="px-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
                  onClick={() => setIsMobileGenresOpen(!isMobileGenresOpen)}
                >
                  <span>Thể loại</span>
                  <ChevronDown size={18} className={`transition-transform ${isMobileGenresOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileGenresOpen && (
                  <div className="mt-2 rounded-lg bg-gray-800 p-2">
                    {genreItems.map((name) => (
                      <div key={name} className="px-2 py-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-md">
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/phim-grid"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Phim Lẻ
              </Link>
              <Link
                to="/series"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Phim Bộ
              </Link>

              {/* Mobile Countries Dropdown */}
              <div className="px-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
                  onClick={() => setIsMobileCountriesOpen(!isMobileCountriesOpen)}
                >
                  <span>Quốc gia</span>
                  <ChevronDown size={18} className={`transition-transform ${isMobileCountriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileCountriesOpen && (
                  <div className="mt-2 rounded-lg bg-gray-800 p-2">
                    {countryItems.map((name) => (
                      <div key={name} className="px-2 py-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-md">
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/actors"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Diễn Viên
              </Link>

              {/* Mobile Auth Button */}
              <div className="px-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getInitials(user.name, user.email)}
                        </span>
                      </div>
                      <span className="text-gray-300">{formatDisplayName(user.name) || 'Người dùng'}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="block w-full rounded-full bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 transition text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chỉnh sửa tài khoản
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;