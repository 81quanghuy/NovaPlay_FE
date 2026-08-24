import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui';
import { PATHS } from '@/routes/paths';


export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-bg text-fg-1 grid place-items-center px-6">
      <div className="text-center max-w-md">
        <span className="inline-flex w-20 h-20 rounded-pill bg-danger/10 border border-danger/40 items-center justify-center mb-6">
          <ShieldX className="w-10 h-10 text-danger" />
        </span>
        <h1 className="font-display font-extrabold text-4xl tracking-tight text-fg mb-3">
          403 — Không Có Quyền Truy Cập
        </h1>
        <p className="text-fg-2 mb-7">
          Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.
        </p>
        <Link to={PATHS.HOME}>
          <Button>Về Trang Chủ</Button>
        </Link>
      </div>
    </div>
  );
}
