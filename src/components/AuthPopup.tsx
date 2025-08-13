import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, X, Heart, Plus, RotateCcw, User, Wallet, ChevronsUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatDisplayName } from '../utils/formatName';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

export default function AuthPopup({ isOpen, onClose, triggerRef }: AuthPopupProps) {
  const { user, logout } = useAuth();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 z-50">
      <div ref={popupRef} className="p-3">
        {user ? (
          // Đã đăng nhập - Hiển thị thông tin user và menu
          <div className="space-y-3">
            {/* Top Section - User Profile & Upgrade */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  {formatDisplayName(user.name) || 'Người dùng'}
                </h3>
              </div>
              <p className="text-xs text-gray-300">
                Nâng cấp tài khoản NovaPlay để có trải nghiệm đẳng cấp hơn.
              </p>
              <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm">
                <span>Nâng cấp ngay</span>
                <ChevronsUp size={14} />
              </button>
            </div>

            {/* Middle Section - Balance */}
            <div className="border-t border-gray-700 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet size={14} className="text-white" />
                  <span className="text-white text-xs">Số dư</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold text-sm">0</span>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-xs">N</span>
                  </div>
                  <button className="bg-white hover:bg-gray-100 text-gray-900 text-xs px-2 py-1 rounded-lg transition-colors flex items-center space-x-1">
                    <Plus size={10} />
                    <span>Nạp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Menu Items */}
            <div className="border-t border-gray-700 pt-2 space-y-1">
              <Link
                to="/favorites"
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-xs text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Heart size={14} />
                <span>Yêu thích</span>
              </Link>
              
              <Link
                to="/lists"
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-xs text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Plus size={14} />
                <span>Danh sách</span>
              </Link>
              
              <Link
                to="/continue-watching"
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-xs text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <RotateCcw size={14} />
                <span>Xem tiếp</span>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-xs text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                <User size={14} />
                <span>Tài khoản</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-xs text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                <span>Thoát</span>
              </button>
            </div>
          </div>
        ) : (
          // Chưa đăng nhập - Hiển thị form đăng nhập
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
              <h3 className="text-base font-semibold text-white">
                Đăng nhập
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-300">
                Đăng nhập để truy cập đầy đủ tính năng
              </p>
              
              <Link
                to="/auth"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-3 rounded-lg transition-colors text-center block text-sm"
                onClick={onClose}
              >
                Đăng nhập ngay
              </Link>
              
              <div className="text-center">
                <span className="text-xs text-gray-400">
                  Chưa có tài khoản?{' '}
                  <Link
                    to="/register"
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                    onClick={onClose}
                  >
                    Đăng ký
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
