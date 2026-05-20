import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/features/auth/components/Button';
import { MovieCard } from '../components/MovieCard';
import { MOVIES } from '../data/movies';
import { useWatchlistStore } from '../store/watchlistStore';

export function WatchlistPage() {
  const ids = useWatchlistStore((s) => s.ids);
  const clear = useWatchlistStore((s) => s.clear);
  const list = MOVIES.filter((m) => ids.includes(m.id));

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <Navbar />
      <div className="max-w-container mx-auto px-6 lg:px-16 py-10">
        <header className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-4xl text-fg">Yêu Thích Của Bạn</h1>
            <p className="text-fg-2 mt-2">
              {list.length > 0
                ? `${list.length} phim đang chờ bạn thưởng thức.`
                : 'Chưa có phim nào trong danh sách.'}
            </p>
          </div>
          {list.length > 0 && (
            <Button variant="ghost" onClick={clear}>
              Xoá tất cả
            </Button>
          )}
        </header>

        {list.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-pill bg-primary-soft grid place-items-center mb-5">
              <Bookmark className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-fg mb-2">Danh sách trống</h2>
            <p className="text-fg-2 mb-6 max-w-md mx-auto">
              Khi bạn thêm phim yêu thích, chúng sẽ hiện ra ở đây để dễ dàng xem lại sau.
            </p>
            <Link to="/movies">
              <Button variant="primary">Khám Phá Phim</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {list.map((m) => (
              <MovieCard key={m.id} movie={m} size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
