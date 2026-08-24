import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { APP_EVENTS } from '@/config';
import { PATHS } from '@/routes/paths';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

export function AuthExpiredListener() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function onAuthExpired() {
      setVisible(true);
      navigate(PATHS.LOGIN, { replace: true });
      timeoutId = setTimeout(() => setVisible(false), 5000);
    }

    window.addEventListener(APP_EVENTS.AUTH_EXPIRED, onAuthExpired);
    return () => {
      window.removeEventListener(APP_EVENTS.AUTH_EXPIRED, onAuthExpired);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      {visible && (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-md border border-danger/40 bg-danger px-4 py-3 text-sm font-medium text-white shadow-lg">
          Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
        </div>
      )}
      <Outlet />
    </>
  );
}
