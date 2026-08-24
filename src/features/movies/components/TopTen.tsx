import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flame, TrendingUp, Trophy } from 'lucide-react';
import type { Movie } from '../types';
import { PATHS } from '@/routes/paths';

interface Props {
  movies: Movie[];
}

export function TopTen({ movies }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Smooth wheel scrolling
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el!.scrollLeft += e.deltaY * 1.2;
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="py-10 select-none">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline gap-3">
            <div className="w-2 h-7 rounded-pill bg-grad-brand flex-shrink-0 shadow-glow" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-fg tracking-tight">
                  Top 10 Phim Đỉnh Cao
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-gold/15 border border-gold/40 text-gold text-xs font-bold shadow-sm">
                  <Trophy className="w-3 h-3" /> Thịnh Hành Hôm Nay
                </span>
              </div>
              <p className="text-xs sm:text-sm text-fg-3 mt-1">
                Bảng xếp hạng phim được xem nhiều nhất và đánh giá cao nhất
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {movies.slice(0, 10).map((movie, index) => {
          const rank = index + 1;
          const isTop1 = rank === 1;
          const isTop2 = rank === 2;
          const isTop3 = rank === 3;

          let numColor = 'text-fg/10 [-webkit-text-stroke:2px_rgba(255,255,255,0.15)] group-hover:text-fg/20';
          if (isTop1) {
            numColor = 'text-gold/25 [-webkit-text-stroke:2px_rgba(255,200,58,0.7)] group-hover:text-gold/40 drop-shadow-[0_0_20px_rgba(255,200,58,0.4)]';
          } else if (isTop2) {
            numColor = 'text-primary/25 [-webkit-text-stroke:2px_rgba(6,182,212,0.7)] group-hover:text-primary/40 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]';
          } else if (isTop3) {
            numColor = 'text-cyan/20 [-webkit-text-stroke:2px_rgba(42,212,255,0.6)] group-hover:text-cyan/35';
          }

          return (
            <Link
              key={movie.id}
              to={PATHS.MOVIE_DETAIL(movie.id)}
              className="flex-shrink-0 flex items-end gap-2 sm:gap-3 group snap-start"
            >
              {/* 3D Big Number Typography */}
              <span
                className={`font-display font-black leading-none select-none flex-shrink-0 text-[clamp(90px,10vw,140px)] transition-all duration-300 ${numColor}`}
              >
                {rank}
              </span>

              {/* Poster Card with 3D Border & Glow */}
              <div className="relative w-[130px] sm:w-[155px] lg:w-[175px] aspect-[2/3] rounded-2xl overflow-hidden bg-surface-2 shadow-2xl border border-white/10 flex-shrink-0 transition-all duration-base ease-np-out group-hover:scale-105 group-hover:border-primary/60 group-hover:shadow-[0_0_35px_rgb(var(--np-primary-rgb)/0.4)]">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.add('hidden');
                  }}
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Trending Badge Overlay */}
                <div className="absolute top-2 left-2 z-10">
                  {isTop1 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold text-bg font-extrabold text-[10px] shadow-glow">
                      <Flame className="w-3 h-3 fill-current" /> TOP 1
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-primary text-[10px] font-bold">
                      <TrendingUp className="w-3 h-3" /> +{30 - rank * 2}%
                    </span>
                  )}
                </div>

                {/* Bottom title on hover */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-base">
                  <p className="text-xs font-bold text-fg truncate">{movie.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
