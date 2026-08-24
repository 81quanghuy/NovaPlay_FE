import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui';
import { PATHS } from '@/routes/paths';

interface Props {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'split' | 'center';
  icon?: ReactNode;
}

const HERO_BACKDROP =
  'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg';

export function AuthLayout({ title, subtitle, children, footer, variant = 'split', icon }: Props) {
  return (
    <div className="min-h-screen w-full bg-bg text-fg-1 font-body grid lg:grid-cols-2">
      {variant === 'split' && (
        <aside aria-hidden className="relative hidden lg:block overflow-hidden">
          <img
            src={HERO_BACKDROP}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-grad-hero-left" />
          <div className="absolute inset-0 bg-grad-hero-bottom" />
          <div className="relative h-full flex flex-col p-10 xl:p-14">
            <Link to={PATHS.HOME} className="inline-flex w-fit">
              <Logo size="md" />
            </Link>
            <div className="mt-auto max-w-md">
              <h1 className="font-display font-extrabold text-4xl xl:text-5xl leading-[1.05] tracking-tight text-fg mb-4">
                Kho Phim Trực Tuyến Cho Mọi Tâm Trạng
              </h1>
              <p className="text-fg-2 text-lg leading-relaxed">
                Kích hoạt tài khoản để lưu danh sách yêu thích, tiếp tục xem từ mọi thiết
                bị, và khám phá những bộ phim mới nhất.
              </p>
            </div>
          </div>
        </aside>
      )}

      <main
        className={`flex flex-col items-center justify-center px-6 py-10 lg:py-14 ${
          variant === 'center' ? 'lg:col-span-2' : ''
        }`}
      >
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to={PATHS.HOME}>
              <Logo size="md" />
            </Link>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-lg p-6 md:p-8">
            {icon && <div className="flex justify-center mb-4">{icon}</div>}
            <h2 className="font-display font-extrabold text-3xl leading-tight tracking-tight text-fg text-center">
              {title}
            </h2>
            {subtitle && (
              <p className="text-fg-2 text-base text-center mt-2 mb-7">{subtitle}</p>
            )}
            {!subtitle && <div className="mb-7" />}
            {children}
          </div>

          {footer && (
            <div className="text-center text-sm text-fg-2 mt-6">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
