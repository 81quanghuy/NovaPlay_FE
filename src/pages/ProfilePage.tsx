
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Heart, Plus, RotateCcw, Bell, User, Camera, LogOut } from 'lucide-react';
import { formatDisplayName, getInitials } from '../utils/formatName';
import PasswordChangeModal from '../components/PasswordChangeModal';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const { user, isLoading: authLoading, keycloak, logout } = useAuth();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.name || '',
    gender: 'male'
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAvatar, setIsSubmittingAvatar] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean } | null>(null);

  // Lấy tên hiển thị đã được format
  const displayName = formatDisplayName(user?.name);
  const displayEmail = user?.email || '';

  // Xử lý thay đổi avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý thay đổi form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý đổi mật khẩu thông qua modal
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account/credentials/password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setToast({ type: 'success', message: 'Đổi mật khẩu thành công!', isVisible: true });
        return Promise.resolve();
      } else {
        throw new Error('Không thể đổi mật khẩu');
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi đổi mật khẩu', isVisible: true });
      return Promise.reject(error);
    }
  };

  // Lưu thông tin profile
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    setToast(null);

    try {
      // Cập nhật thông tin user thông qua Keycloak
      const response = await fetch(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: user?.email, // Keep email as is, not editable
        }),
      });

      if (response.ok) {
        setToast({ type: 'success', message: 'Cập nhật thông tin thành công!', isVisible: true });
        // Refresh user data
        await keycloak.updateToken(30);
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật thông tin', isVisible: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lưu avatar
  const handleSaveAvatar = async () => {
    if (!avatar) return;

    setIsSubmittingAvatar(true);
    setToast(null);

    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await fetch(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setToast({ type: 'success', message: 'Cập nhật avatar thành công!', isVisible: true });
        setIsEditingAvatar(false);
        // Refresh user data
        await keycloak.updateToken(30);
      } else {
        throw new Error('Không thể cập nhật avatar');
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi cập nhật avatar', isVisible: true });
    } finally {
      setIsSubmittingAvatar(false);
    }
  };

  // Hủy chỉnh sửa avatar
  const handleCancelAvatar = () => {
    setIsEditingAvatar(false);
    setAvatar(null);
    setAvatarPreview('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bạn cần đăng nhập để xem trang này
          </h1>
          <Link
            to="/auth"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6 border-r border-gray-700 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-8">
            Quản lý tài khoản
          </h2>

          {/* Menu Items */}
          <div className="space-y-3 mb-8">
            <Link to="/favorites" className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Heart size={18} />
              <span>Yêu thích</span>
            </Link>

            <Link to="/lists" className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Plus size={18} />
              <span>Danh sách</span>
            </Link>

            <Link to="/continue-watching" className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <RotateCcw size={18} />
              <span>Xem tiếp</span>
            </Link>

            <Link to="/notifications" className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Bell size={18} />
              <span>Thông báo</span>
            </Link>

            <div className="flex items-center space-x-3 w-full px-3 py-2 text-sm bg-yellow-500 text-black rounded-lg">
              <User size={18} />
              <span>Tài khoản</span>
            </div>
          </div>

          {/* User Info at Bottom - Sử dụng mt-auto để đẩy xuống cuối */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {getInitials(user?.name, user?.email)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-white flex items-center space-x-2">
                  <span>{displayName || 'Người dùng'}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {displayEmail}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={logout} title="Đăng xuất">
              <LogOut size={18} />
              <span>Thoát</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 mt-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Tài khoản
            </h1>
            <p className="text-gray-400">
              Cập nhật thông tin tài khoản
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Form */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Thông tin cá nhân</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={displayEmail || 'Chưa có'}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white cursor-not-allowed"
                    title="Email không thể thay đổi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên hiển thị"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Giới tính
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Nam</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Nữ</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="undefined"
                        checked={formData.gender === 'undefined'}
                        onChange={handleInputChange}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Không xác định</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSubmitting}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        <span>Đang cập nhật...</span>
                      </div>
                    ) : (
                      'Cập nhật'
                    )}
                  </button>
                </div>

                {/* Password Change Link */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    Đổi mật khẩu, nhấn vào đây
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Ảnh đại diện</h3>
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-4xl">
                        {getInitials(user?.name, user?.email)}
                      </span>
                    )}
                  </div>

                  {isEditingAvatar && (
                    <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full cursor-pointer transition-colors">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {!isEditingAvatar ? (
                    <button
                      onClick={() => setIsEditingAvatar(true)}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Camera size={16} />
                      <span>Thay đổi ảnh</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleSaveAvatar}
                        disabled={isSubmittingAvatar || !avatar}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-lg"
                      >
                        {isSubmittingAvatar ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang cập nhật...</span>
                          </div>
                        ) : (
                          'Lưu ảnh đại diện'
                        )}
                      </button>
                      <button
                        onClick={handleCancelAvatar}
                        disabled={isSubmittingAvatar}
                        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-lg"
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  {avatar && (
                    <div className="text-sm text-gray-400">
                      Đã chọn: {avatar.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </div>
  );
}
