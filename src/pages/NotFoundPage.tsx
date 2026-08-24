import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { PATHS } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-fg-1 grid place-items-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-border grid place-items-center">
            <SearchX className="w-10 h-10 text-fg-3" />
          </div>
        </div>
        <h1 className="font-display font-extrabold text-6xl text-fg mb-2">404</h1>
        <p className="font-display font-bold text-2xl text-fg-1 mb-3">Không tìm thấy trang</p>
        <p className="text-fg-2 text-base leading-relaxed mb-8">
          Trang bạn đang tìm không tồn tại hoặc đã bị xóa. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
        <Link
          to={PATHS.HOME}
          className="inline-flex items-center gap-2 bg-primary text-white font-display font-semibold rounded-pill h-11 px-6 transition-all duration-base ease-np-out hover:bg-primary-hover active:scale-[0.97]"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
