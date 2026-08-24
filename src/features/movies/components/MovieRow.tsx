import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { PATHS } from '@/routes/paths';

interface Props {
  title: string;
  subtitle?: string;
  movies: Movie[];
  /** Đường dẫn khi bấm Xem tất cả */
  to?: string;
  /** Nếu có genre, tự tạo link to /movies?genre= */
  genre?: string;
}

export function MovieRow({ title, subtitle, movies, to, genre }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: 'left' | 'right') => {
    const el = scroller.current;
    if (!el) return;
    const dx = el.clientWidth * 0.85 * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  const targetLink = to || (genre ? `${PATHS.MOVIES}?genre=${encodeURIComponent(genre)}` : PATHS.MOVIES);

  return (
    <section className="py-6">
      <div className="max-w-container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <div className="w-1.5 h-6 rounded-pill bg-grad-brand flex-shrink-0 shadow-glow" />
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-fg leading-tight">
                {title}
              </h2>
              {subtitle && <p className="text-xs sm:text-sm text-fg-3 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(targetLink)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-fg-2 hover:text-primary transition-colors"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </button>
            <div className="hidden md:flex gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 grid place-items-center rounded-pill bg-white/5 border border-white/10 text-fg-1 hover:text-primary hover:bg-white/10 transition-colors"
                aria-label="Cuộn trái"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 grid place-items-center rounded-pill bg-white/5 border border-white/10 text-fg-1 hover:text-primary hover:bg-white/10 transition-colors"
                aria-label="Cuộn phải"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Horizontal Scroll Track */}
      <div
        ref={scroller}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
