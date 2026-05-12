import { Play } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/features/auth/components/Button';
import { useLogout } from '@/features/auth/hooks/useLogout';

const HERO_BACKDROP =
  'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg';

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();
  const roles = (user?.roles ?? []).map((r) => r.roleName).join(', ') || 'USER';

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <Navbar />

      <section
        className="relative h-[480px] lg:h-[560px] w-full overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BACKDROP})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-grad-hero-left" />
        <div className="absolute inset-0 bg-grad-hero-bottom" />
        <div className="relative max-w-container mx-auto h-full px-6 lg:px-16 flex flex-col justify-end pb-16">
          <span className="text-xs uppercase tracking-[0.08em] font-semibold text-primary-hover mb-3">
            Chào mừng
          </span>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-[1.05] tracking-tight text-fg max-w-3xl">
            Xin Chào, {user?.username || 'Thành Viên'}
          </h1>
          <p className="text-fg-2 text-lg mt-4 max-w-2xl">
            Bạn đã đăng nhập với vai trò:{' '}
            <span className="text-fg-1 font-semibold">{roles}</span>. Hãy khám phá kho phim
            đang chờ bạn.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Button variant="primary" leftIcon={<Play className="w-4 h-4 fill-current" />} disabled>
              Khám Phá Phim
            </Button>
            <Button variant="secondary" onClick={logout} loading={isLoading}>
              Đăng Xuất
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-16 py-12">
        <div className="bg-surface border border-border rounded-xl p-6 lg:p-8">
          <h2 className="font-display font-bold text-2xl text-fg mb-2">Thông Tin Tài Khoản</h2>
          <p className="text-fg-2 mb-5">Dữ liệu lấy từ endpoint <code className="font-mono text-fg-1">/auth/me</code>.</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-fg-3">Username</dt>
              <dd className="text-fg-1 font-medium">{user?.username}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-fg-3">Email</dt>
              <dd className="text-fg-1 font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-fg-3">Trạng thái</dt>
              <dd className="text-success font-medium">
                {user?.isActive ? 'Đang hoạt động' : 'Khóa'}
              </dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-fg-3">Xác thực email</dt>
              <dd className={user?.isEmailVerified ? 'text-success font-medium' : 'text-warning font-medium'}>
                {user?.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
