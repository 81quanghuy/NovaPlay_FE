import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Layout chính cho các trang phim (public và protected).
 * Tự động thêm Navbar + Footer, trang không cần tự gọi.
 * Có padding-top bù cho Navbar fixed (h-16 = 64px).
 */
export function MainLayout() {
  return (
    <div className="min-h-screen bg-bg text-fg-1 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
