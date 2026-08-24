import { Link } from 'react-router-dom';
import { History, Play, Trash2, X } from 'lucide-react';
import { useHistoryStore } from '../store/historyStore';
import { getMovie } from '../data/movies';
import { PATHS } from '@/routes/paths';

function getProgressWidthClass(percent: number): string {
  if (percent >= 90) return 'w-[90%]';
  if (percent >= 75) return 'w-[75%]';
  if (percent >= 60) return 'w-[60%]';
  if (percent >= 45) return 'w-[45%]';
  if (percent >= 30) return 'w-[30%]';
  return 'w-[20%]';
}

export function ContinueWatchingRow() {
  const history = useHistoryStore((s) => s.history);
  const removeFromHistory = useHistoryStore((s) => s.removeFromHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  if (history.length === 0) return null;

  return (
    <section className="py-6 select-none">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <div className="w-2 h-6 rounded-pill bg-grad-brand flex-shrink-0 shadow-glow" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-fg tracking-tight">
                  Tiếp Tục Xem
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-primary/15 border border-primary/30 text-primary text-xs font-bold shadow-sm">
                  <History className="w-3 h-3" /> Đang theo dõi ({history.length})
                </span>
              </div>
              <p className="text-xs text-fg-3 mt-0.5">Tiếp tục thưởng thức các bộ phim bạn đang xem dở</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearHistory}
            className="text-xs font-semibold text-fg-3 hover:text-danger inline-flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
          </button>
        </div>

        {/* Continue Watching Horizontal Track */}
        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                className="relative w-[240px] sm:w-[280px] flex-shrink-0 group rounded-2xl overflow-hidden bg-surface-2 border border-white/10 shadow-lg hover:border-primary/50 hover:shadow-glow transition-all duration-base"
              >
                {/* Backdrop Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-surface">
                  <img
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />

                  {/* Play Button Overlay on Hover */}
                  <Link
                    to={PATHS.WATCH(movie.id)}
                    aria-label={`Xem tiếp ${movie.title}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-pill bg-primary text-white grid place-items-center shadow-glow">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </Link>

                  {/* Remove item button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromHistory(movie.id);
                    }}
                    aria-label="Xóa khỏi lịch sử"
                    className="absolute top-2 right-2 w-7 h-7 rounded-pill bg-black/60 hover:bg-danger text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Progress Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-bold text-fg-1">
                    {progressLabel}
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full h-1 bg-white/10 relative">
                  <div
                    className={`h-full bg-primary shadow-glow transition-all ${getProgressWidthClass(
                      item.progressPercent,
                    )}`}
                  />
                </div>

                {/* Card Title & CTA */}
                <div className="p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={PATHS.MOVIE_DETAIL(movie.id)}
                      className="block text-sm font-bold text-fg truncate hover:text-primary transition-colors"
                    >
                      {movie.title}
                    </Link>
                    <p className="text-xs text-fg-3 truncate mt-0.5">
                      {movie.releaseYear} · {movie.genres[0]}
                    </p>
                  </div>

                  <Link
                    to={PATHS.WATCH(movie.id)}
                    className="px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
                  >
                    Xem tiếp
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
