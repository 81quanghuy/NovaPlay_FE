import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../data/movies';
import { MovieCard } from './MovieCard';

interface Props {
  title: string;
  subtitle?: string;
  movies: Movie[];
}

export function MovieRow({ title, subtitle, movies }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scroller.current;
    if (!el) return;
    const dx = el.clientWidth * 0.85 * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-fg leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-fg-3 mt-1">{subtitle}</p>}
        </div>
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-9 h-9 grid place-items-center rounded-pill bg-white/5 border border-border text-fg-1 hover:bg-white/10 transition-colors"
            aria-label="Cuộn trái"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-9 h-9 grid place-items-center rounded-pill bg-white/5 border border-border text-fg-1 hover:bg-white/10 transition-colors"
            aria-label="Cuộn phải"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-6 px-6 lg:-mx-16 lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
