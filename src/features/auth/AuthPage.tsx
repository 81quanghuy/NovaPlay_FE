import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading';

export default function AuthPage() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        login();
      } else {
        // Xóa query/hash để tránh vòng lặp
        window.history.replaceState({}, document.title, window.location.pathname);

        // ✅ Chuyển về trang chủ
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, user, login, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Loading />;
  }

  return null;
}
