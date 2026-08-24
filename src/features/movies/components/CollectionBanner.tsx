import { Link } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import type { Movie } from '../types';
import { PATHS } from '@/routes/paths';

interface Props {
  title: string;
  subtitle: string;
  tag?: string;
  backdropUrl: string;
  movies: Movie[];
}

export function CollectionBanner({
  title,
  subtitle,
  tag = 'Bộ Sưu Tập Độc Quyền',
  backdropUrl,
  movies,
}: Props) {
  return (
    <section className="py-8 select-none">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-surface shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Ambient Backdrop Image with Scrim */}
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).classList.add('hidden');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

          {/* Ambient Glow Spotlight */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-pill blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary/20 border border-primary/40 text-primary text-xs font-extrabold uppercase tracking-wider mb-4 shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
                {tag}
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-fg leading-tight mb-3">
                {title}
              </h3>

              <p className="text-fg-2 text-sm sm:text-base leading-relaxed mb-6">
                {subtitle}
              </p>

              {movies[0] && (
                <Link
                  to={PATHS.WATCH(movies[0].id)}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-pill bg-primary text-white font-display font-bold text-sm sm:text-base hover:bg-primary-hover shadow-glow transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" /> Khám Phá Ngay
                </Link>
              )}
            </div>

            {/* Movie Thumbnails in Collection */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto max-w-full pb-2 [scrollbar-width:none]">
              {movies.slice(0, 4).map((movie) => (
                <Link
                  key={movie.id}
                  to={PATHS.MOVIE_DETAIL(movie.id)}
                  className="group/mini relative w-[110px] sm:w-[130px] aspect-[2/3] rounded-xl overflow-hidden bg-surface-2 border border-white/10 shadow-lg flex-shrink-0 transition-all duration-base hover:scale-105 hover:border-primary/60 hover:shadow-glow"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover/mini:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-[11px] font-bold text-fg truncate">{movie.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
