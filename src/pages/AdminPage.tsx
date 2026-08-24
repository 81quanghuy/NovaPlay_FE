import { Navbar } from '@/components/layout/Navbar';
import { ShieldCheck } from 'lucide-react';


export function AdminPage() {
  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <Navbar />
      <main className="max-w-container mx-auto px-6 py-12">
        <div className="bg-surface border border-border rounded-xl p-8 flex items-start gap-4">
          <span className="w-12 h-12 rounded-pill bg-primary-soft border border-primary/40 grid place-items-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-primary-hover" />
          </span>
          <div>
            <h1 className="font-display font-bold text-2xl text-fg mb-1.5">Khu Vực Quản Trị</h1>
            <p className="text-fg-2">
              Trang này chỉ dành cho tài khoản có vai trò{' '}
              <span className="font-mono text-fg-1">ADMIN</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
