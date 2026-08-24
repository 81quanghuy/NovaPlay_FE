import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube } from 'lucide-react';
import { APP, FOOTER_COLS } from '@/config';
import { Logo } from '@/components/ui';

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: null },
  { icon: Twitter, label: 'Twitter', href: null },
  { icon: Youtube, label: 'YouTube', href: null },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg border-t border-border mt-16">
      <div className="max-w-container mx-auto px-6 lg:px-8 pt-12 pb-8">
        {/* Cột trên */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo + mô tả */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo size="sm" />
            <p className="text-fg-3 text-sm leading-relaxed mt-4 max-w-xs">
              Nền tảng xem phim trực tuyến chất lượng cao dành cho mọi tâm trạng.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 grid place-items-center rounded-md text-fg-3 hover:text-fg hover:bg-white/5 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    key={label}
                    type="button"
                    disabled
                    title={`${label} — Sắp ra mắt`}
                    aria-label={label}
                    className="w-8 h-8 grid place-items-center rounded-md text-fg-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Cột link */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-fg-1 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-fg-3 hover:text-fg-1 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span
                        className="text-sm text-fg-3 opacity-50 cursor-not-allowed"
                        title="Sắp ra mắt"
                      >
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dòng dưới — bản quyền */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-fg-3">
            © {APP.COPYRIGHT_START_YEAR}–{currentYear} {APP.NAME}. Mọi quyền được bảo lưu.
          </p>
          <p className="text-xs text-fg-3">
            Dữ liệu phim từ{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg-1 transition-colors underline underline-offset-2"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
