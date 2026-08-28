import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Camera,
  CheckCircle2,
  Crown,
  Film,
  Flame,
  KeyRound,
  Save,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';
import { useHistoryStore } from '@/features/movies/store/historyStore';
import { PATHS } from '@/routes/paths';
import { userService } from '../services/userService';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const watchlistCount = useWatchlistStore((s) => s.ids.length);
  const historyCount = useHistoryStore((s) => s.history.length);

  const [fullName, setFullName] = useState(user?.fullName || user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await userService.getProfile();
      if (profile) {
        if (profile.fullName) setFullName(profile.fullName);
        else if (profile.displayName) setFullName(profile.displayName);
        else if (profile.username) setFullName(profile.username);

        if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber);
        if (profile.bio) setBio(profile.bio);
        if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
      }
    })();
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const updated = await userService.updateProfile({ fullName, phoneNumber, bio });
    if (updated) {
      setUser({
        ...user,
        ...updated,
        fullName: updated.fullName || fullName,
        username: updated.username || user?.username || '',
        email: updated.email || user?.email || '',
        roles: updated.roles || user?.roles || [],
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  const initial = (fullName?.[0] || user?.username?.[0] || 'N').toUpperCase();

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-border">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 text-primary grid place-items-center shadow-glow flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
            Quản lý thông tin tài khoản, cài đặt cá nhân và gói thuê bao điện ảnh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column: User Card & Stats ────────────────────────────── */}
        <div className="space-y-6">
          {/* Avatar & Info Card */}
          <div className="bg-surface-2 border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-pill blur-3xl pointer-events-none" />

            {/* Avatar with Upload button */}
            <div className="relative w-28 h-28 mx-auto mb-4 group">
              <div className="w-full h-full rounded-pill overflow-hidden bg-grad-brand p-1 shadow-glow">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={fullName}
                    className="w-full h-full object-cover rounded-pill"
                  />
                ) : (
                  <div className="w-full h-full rounded-pill bg-surface-2 grid place-items-center font-display font-black text-3xl text-primary">
                    {initial}
                  </div>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                title="Thay đổi ảnh đại diện"
                className="absolute bottom-0 right-0 w-9 h-9 rounded-pill bg-primary text-white grid place-items-center shadow-glow cursor-pointer hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="font-display font-black text-xl text-fg mb-1">
              {fullName}
            </h2>
            <p className="text-xs text-fg-3 mb-4">{user?.email || 'user@example.com'}</p>

            {/* VIP Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gold/15 border border-gold/40 text-gold text-xs font-black shadow-sm mb-6">
              <Crown className="w-4 h-4 fill-gold" /> Thành Viên VIP 4K
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <Bookmark className="w-4 h-4 text-primary mx-auto mb-1" />
                <span className="font-display font-black text-base text-fg block">
                  {watchlistCount}
                </span>
                <span className="text-[10px] text-fg-3 font-semibold">Yêu thích</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <Film className="w-4 h-4 text-primary mx-auto mb-1" />
                <span className="font-display font-black text-base text-fg block">
                  {historyCount}
                </span>
                <span className="text-[10px] text-fg-3 font-semibold">Đã xem</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <Flame className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="font-display font-black text-base text-gold block">
                  3 ngày
                </span>
                <span className="text-[10px] text-fg-3 font-semibold">Chuỗi xem</span>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-surface-2 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold" />
                <h3 className="font-display font-extrabold text-sm text-fg">
                  Gói Dịch Vụ Của Bạn
                </h3>
              </div>
              <span className="text-xs font-black text-success">Đang Hoạt Động</span>
            </div>

            <div className="space-y-2 mb-5 text-xs text-fg-2">
              <div className="flex justify-between">
                <span className="text-fg-3">Loại gói:</span>
                <strong className="text-fg font-bold">VIP 4K Ultra HD (1 Năm)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-3">Hạn sử dụng:</span>
                <strong className="text-fg font-bold">25/08/2027</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-3">Chất lượng:</span>
                <strong className="text-primary font-bold">4K HDR + Dolby Atmos</strong>
              </div>
            </div>

            <Link
              to={PATHS.PRICING}
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/40 text-xs font-bold text-fg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Đổi Gói Cước / Gia Hạn
            </Link>
          </div>
        </div>

        {/* ── Right Column: Edit Profile Form & Settings ────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-surface-2 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <h3 className="font-display font-black text-lg text-fg mb-6 pb-4 border-b border-white/10">
              Thông Tin Tài Khoản
            </h3>

            {isSaved && (
              <div className="mb-6 p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Đã lưu thông tin hồ sơ thành công!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="profile-fullname" className="block text-xs font-extrabold text-fg-3 mb-2 uppercase tracking-wider">
                  Họ và Tên
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-fg outline-none focus:border-primary font-medium"
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-xs font-extrabold text-fg-3 mb-2 uppercase tracking-wider">
                  Số Điện Thoại
                </label>
                <input
                  id="profile-phone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-fg outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="profile-email" className="block text-xs font-extrabold text-fg-3 mb-2 uppercase tracking-wider">
                  Email (Không thể thay đổi)
                </label>
                <input
                  id="profile-email"
                  type="text"
                  disabled
                  value={user?.email || 'user@example.com'}
                  className="w-full bg-surface/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-fg-3 cursor-not-allowed font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="profile-bio" className="block text-xs font-extrabold text-fg-3 mb-2 uppercase tracking-wider">
                  Tiểu Sử (Bio)
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ gu xem phim của bạn..."
                  className="w-full bg-surface border border-white/10 rounded-xl p-4 text-sm text-fg outline-none focus:border-primary font-medium resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" /> Lưu Thay Đổi
              </button>
            </div>
          </form>

          {/* Security & Password Card */}
          <div className="bg-surface-2 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-primary grid place-items-center flex-shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-base text-fg">
                  Bảo Mật & Mật Khẩu
                </h4>
                <p className="text-xs text-fg-3 mt-0.5">
                  Đổi mật khẩu định kỳ để bảo vệ tài khoản NovaPlay của bạn.
                </p>
              </div>
            </div>

            <Link
              to={PATHS.CHANGE_PASSWORD}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-border hover:border-primary/40 hover:bg-white/10 text-xs sm:text-sm font-extrabold text-fg transition-all flex-shrink-0"
            >
              Đổi Mật Khẩu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
