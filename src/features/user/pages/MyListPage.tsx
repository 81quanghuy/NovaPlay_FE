import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Clock,
  Film,
  History,
  Play,
  Trash2,
  X,
} from 'lucide-react';
import {
  MovieCard,
  useWatchlistStore,
  useHistoryStore,
  getMovie,
  MOVIES,
} from '@/features/movies';
import { PATHS } from '@/routes/paths';

function getProgressWidthClass(percent: number): string {
  if (percent >= 90) return 'w-[90%]';
  if (percent >= 75) return 'w-[75%]';
  if (percent >= 60) return 'w-[60%]';
  if (percent >= 45) return 'w-[45%]';
  if (percent >= 30) return 'w-[30%]';
  return 'w-[20%]';
}

export function MyListPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const watchlistIds = useWatchlistStore((s) => s.ids);
  const clearWatchlist = useWatchlistStore((s) => s.clear);
  const history = useHistoryStore((s) => s.history);
  const removeFromHistory = useHistoryStore((s) => s.removeFromHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  // Favorite movies list
  const favoriteMovies = useMemo(() => {
    return MOVIES.filter((m) => watchlistIds.includes(m.id));
  }, [watchlistIds]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 text-primary grid place-items-center shadow-glow flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
              Kho Phim Cá Nhân
            </h1>
            <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
              Quản lý danh sách phim yêu thích và theo dõi lịch sử xem phim của bạn
            </p>
          </div>
        </div>

        {/* Clear buttons */}
        <div>
          {activeTab === 'favorites' && favoriteMovies.length > 0 && (
            <button
              type="button"
              onClick={clearWatchlist}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-border text-fg-3 hover:text-danger hover:border-danger/30 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xóa tất cả yêu thích
            </button>
          )}

          {activeTab === 'history' && history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-border text-fg-3 hover:text-danger hover:border-danger/30 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xóa lịch sử xem
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'favorites'
              ? 'bg-primary text-white shadow-glow'
              : 'bg-surface-2 border border-white/5 text-fg-3 hover:text-fg hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Danh Sách Yêu Thích ({favoriteMovies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'history'
              ? 'bg-primary text-white shadow-glow'
              : 'bg-surface-2 border border-white/5 text-fg-3 hover:text-fg hover:bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch Sử Xem ({history.length})</span>
        </button>
      </div>

      {/* Tab 1: Favorites Grid */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteMovies.length === 0 ? (
            <div className="bg-surface-2/60 border border-white/5 rounded-3xl p-16 text-center">
              <Film className="w-16 h-16 mx-auto mb-4 text-fg-3 opacity-30" />
              <h3 className="font-display font-extrabold text-lg text-fg mb-1">
                Danh sách yêu thích đang trống
              </h3>
              <p className="text-xs sm:text-sm text-fg-3 max-w-md mx-auto mb-6">
                Hãy nhấn vào biểu tượng Bookmark trên các bộ phim bạn thích để lưu lại và thưởng thức sau.
              </p>
              <Link
                to={PATHS.MOVIES}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow"
              >
                Khám Phá Phim Ngay
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="sm" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Watch History Grid */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="bg-surface-2/60 border border-white/5 rounded-3xl p-16 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-fg-3 opacity-30" />
              <h3 className="font-display font-extrabold text-lg text-fg mb-1">
                Chưa có lịch sử xem phim
              </h3>
              <p className="text-xs sm:text-sm text-fg-3 max-w-md mx-auto mb-6">
                Tiến độ xem phim của bạn sẽ được tự động lưu lại đây khi bạn bắt đầu xem một bộ phim.
              </p>
              <Link
                to={PATHS.MOVIES}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow"
              >
                Xem Phim Ngay
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {history.map((item) => {
                const movie = getMovie(item.movieId);
                if (!movie) return null;

                const isSeries = movie.type === 'series';
                const progressLabel = isSeries
                  ? `Tập ${item.episode || 1} · Còn ${(100 - item.progressPercent).toFixed(0)}%`
                  : `Đã xem ${item.progressPercent}%`;

                return (
                  <div
                    key={item.movieId}
                    className="group relative rounded-2xl overflow-hidden bg-surface-2 border border-white/10 shadow-lg hover:border-primary/50 hover:shadow-glow transition-all duration-base flex flex-col justify-between"
                  >
                    {/* Thumbnail with overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-surface">
                      <img
                        src={movie.backdrop || movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

                      {/* Play hover button */}
                      <Link
                        to={PATHS.WATCH(movie.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 rounded-pill bg-primary text-white grid place-items-center shadow-glow">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </Link>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={() => removeFromHistory(movie.id)}
                        aria-label="Xóa khỏi lịch sử"
                        className="absolute top-2 right-2 w-7 h-7 rounded-pill bg-black/60 hover:bg-danger text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Badge */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-bold text-fg-1">
                        {progressLabel}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10">
                      <div
                        className={`h-full bg-primary shadow-glow transition-all ${getProgressWidthClass(
                          item.progressPercent,
                        )}`}
                      />
                    </div>

                    {/* Content Body */}
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={PATHS.MOVIE_DETAIL(movie.id)}
                          className="block text-sm font-extrabold text-fg truncate hover:text-primary transition-colors"
                        >
                          {movie.title}
                        </Link>
                        <p className="text-xs text-fg-3 truncate mt-0.5">
                          {movie.releaseYear} · {movie.genres.join(', ')}
                        </p>
                      </div>

                      <Link
                        to={PATHS.WATCH(movie.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:brightness-110 transition-all flex-shrink-0"
                      >
                        Xem Tiếp
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
