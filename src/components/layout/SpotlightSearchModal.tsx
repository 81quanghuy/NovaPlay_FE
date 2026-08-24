import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Film,
  Flame,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { MOVIES, searchMovies } from '@/features/movies/data/movies';
import { PATHS } from '@/routes/paths';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_KEYWORDS = [
  'Hố Đen Tử Thần',
  'Christopher Nolan',
  'Trò Chơi Con Mực',
  'Dune',
  'Oppenheimer',
  'Anime',
];

export function SpotlightSearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  // Handle ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setQuery('');
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const results = query.trim() ? searchMovies(query).slice(0, 6) : [];

  function handleSelect(movieId: string) {
    navigate(PATHS.MOVIE_DETAIL(movieId));
    handleClose();
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${PATHS.SEARCH}?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 select-none animate-fade-in"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Đóng tìm kiếm"
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
      />


      <div className="relative z-10 w-full max-w-2xl bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-surface-2"
        >
          <Search className="w-5 h-5 text-primary flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm phim, diễn viên, đạo diễn, thể loại..."
            className="flex-1 bg-transparent text-base sm:text-lg text-fg placeholder:text-fg-3 outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-fg-3 hover:text-fg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono text-fg-3">
            ESC
          </span>
        </form>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto [scrollbar-width:none]">
          {query.trim() === '' ? (
            <div>
              {/* Trending Searches */}
              <div className="mb-5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-fg-3 uppercase tracking-wider mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" /> Tìm Kiếm Thịnh Hành
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setQuery(kw)}
                      className="px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10 hover:border-primary/40 hover:bg-white/10 text-xs sm:text-sm font-semibold text-fg-1 hover:text-primary transition-all flex items-center gap-1.5"
                    >
                      <Flame className="w-3 h-3 text-gold" /> {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Picks */}
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-fg-3 uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Đề Xuất Nổi Bật
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOVIES.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelect(m.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2 border border-white/5 hover:border-primary/40 hover:bg-white/10 text-left transition-all group"
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-fg truncate group-hover:text-primary transition-colors">
                          {m.title}
                        </p>
                        <p className="text-[11px] text-fg-3 truncate">
                          {m.releaseYear} · {m.genres[0]}
                        </p>
                      </div>
                      <Star className="w-3.5 h-3.5 text-gold fill-gold mr-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-fg-3">
              <Film className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Không tìm thấy phim phù hợp cho từ khóa &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => handleSelect(movie.id)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-surface-2/80 border border-white/5 hover:border-primary/50 hover:bg-white/10 text-left transition-all group"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-xl flex-shrink-0 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30">
                        {movie.quality || '4K'}
                      </span>
                      <span className="text-xs font-bold text-gold inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold" /> {movie.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-fg truncate group-hover:text-primary transition-colors">
                      {movie.title}
                    </p>
                    <p className="text-xs text-fg-3 truncate">
                      {movie.releaseYear} · {movie.genres.join(', ')} · {movie.country}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-fg-3 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-surface-2 flex items-center justify-between text-xs text-fg-3">
          <span>Nhấn <strong className="text-fg">Enter</strong> để xem toàn bộ kết quả</span>
          <span className="hidden sm:inline">Phím tắt nhanh: <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white/10 rounded">K</kbd></span>
        </div>
      </div>
    </div>
  );
}
