import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX, Film, Play, Search, Sparkles, Star, Trash2 } from 'lucide-react';
import { Badge, Button, EmptyState, Skeleton } from '@/components/ui';
import { userService } from '../services/userService';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';
import { PATHS } from '@/routes/paths';
import type { MovieSummaryDTO } from '../types';

interface FavoritesGridProps {
  onCountChange?: (count: number) => void;
}

export function FavoritesGrid({ onCountChange }: FavoritesGridProps) {
  const [movies, setMovies] = useState<MovieSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const watchlistIds = useWatchlistStore((s) => s.ids);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getFavorites(0, 100);
      setMovies(res.content);
      onCountChange?.(res.totalElements);
    } catch {
      // Handled gracefully in mock
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites, watchlistIds]);

  const handleRemove = async (e: React.MouseEvent, movieId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await userService.removeFavorite(movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    onCountChange?.(Math.max(0, movies.length - 1));
  };

  // Extract unique genres from favorite movies
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((m) => {
      m.genres?.forEach((g) => genreSet.add(g));
    });
    return Array.from(genreSet);
  }, [movies]);

  // Filter movies by genre and search query
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchGenre = selectedGenre === 'ALL' || m.genres?.includes(selectedGenre);
      const matchQuery =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGenre && matchQuery;
    });
  }, [movies, selectedGenre, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton variant="button" count={4} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 shadow-sm">
        <EmptyState
          icon={Bookmark}
          title="Chưa Có Phim Yêu Thích"
          description="Bạn chưa lưu bộ phim nào vào danh sách của mình. Hãy khám phá và lưu những tác phẩm điện ảnh đỉnh cao để xem lại bất cứ lúc nào!"
          action={{
            label: 'Khám Phá Phim Ngay',
            to: PATHS.MOVIES,
            leftIcon: <Film className="w-4 h-4" />,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar: Genre Filter Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-2/60 border border-border rounded-2xl p-3.5 backdrop-blur-sm">
        {/* Genre filter pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedGenre('ALL')}
            className={`px-3.5 py-1.5 rounded-pill text-xs sm:text-sm font-semibold transition-all select-none flex-shrink-0 ${
              selectedGenre === 'ALL'
                ? 'bg-primary text-white shadow-glow'
                : 'text-fg-2 hover:text-fg hover:bg-white/5 bg-surface-3/50'
            }`}
          >
            Tất Cả ({movies.length})
          </button>
          {availableGenres.map((genre) => {
            const count = movies.filter((m) => m.genres?.includes(genre)).length;
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-pill text-xs sm:text-sm font-semibold transition-all select-none flex-shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-fg-2 hover:text-fg hover:bg-white/5 bg-surface-3/50'
                }`}
              >
                <span>{genre}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-pill font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-fg-3'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[200px] md:w-64">
          <Search className="w-4 h-4 text-fg-3 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm trong danh sách..."
            className="w-full h-9 bg-surface-3/70 border border-border rounded-xl pl-9 pr-3 text-xs sm:text-sm text-fg placeholder:text-fg-3 outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Filtered Empty Results */}
      {filteredMovies.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <p className="text-fg-2 text-sm mb-3">
            Không tìm thấy phim nào phù hợp với bộ lọc hiện tại.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedGenre('ALL');
              setSearchQuery('');
            }}
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => {
            const qualityBadge = [movie.quality || '4K', movie.subtitleType || 'Vietsub'].join(
              ' · ',
            );

            return (
              <div
                key={movie.id}
                className="group relative flex flex-col rounded-2xl bg-surface-2/60 border border-border/80 hover:border-primary/60 transition-all duration-base hover:shadow-[0_0_30px_rgb(var(--np-primary-rgb)/0.3)] overflow-hidden"
              >
                {/* Poster Link */}
                <Link to={PATHS.MOVIE_DETAIL(movie.id)} className="block relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Scrim Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-extrabold bg-primary text-white shadow-glow backdrop-blur-md">
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      {qualityBadge}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 z-10 bg-bg/80 backdrop-blur-md border border-white/10 rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-gold">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span>{movie.rating ? movie.rating.toFixed(1) : '8.8'}</span>
                  </div>

                  {/* Quick Remove Button Hover Overlay */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, movie.id)}
                    aria-label={`Bỏ lưu phim ${movie.title}`}
                    title="Bỏ lưu khỏi danh sách"
                    className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-pill bg-danger/80 hover:bg-danger text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-fast shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Movie Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                  <div>
                    <Link
                      to={PATHS.MOVIE_DETAIL(movie.id)}
                      className="font-display font-bold text-sm text-fg group-hover:text-primary transition-colors line-clamp-1"
                    >
                      {movie.title}
                    </Link>
                    <p className="text-[11px] text-fg-3 line-clamp-1 mt-0.5">
                      {movie.originalTitle || `${movie.releaseYear} · ${movie.duration} phút`}
                    </p>
                  </div>

                  {/* Genre Tags */}
                  <div className="flex flex-wrap gap-1">
                    {movie.genres?.slice(0, 2).map((g) => (
                      <Badge key={g} variant="surface" size="sm" className="text-[10px] px-1.5 py-0">
                        {g}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                    <Link to={PATHS.WATCH(movie.id)} className="w-full">
                      <Button variant="primary" size="sm" fullWidth className="h-8 text-xs px-2">
                        <Play className="w-3 h-3 mr-1 fill-current" />
                        Xem
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => handleRemove(e, movie.id)}
                      className="h-8 text-xs px-2 text-fg-2 hover:text-danger hover:border-danger/40"
                    >
                      <BookmarkX className="w-3 h-3 mr-1" />
                      Bỏ lưu
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
