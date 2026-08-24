import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck, Play, Sparkles } from 'lucide-react';
import type { Movie } from '../types';
import { useWatchlistStore } from '../store/watchlistStore';
import { PATHS } from '@/routes/paths';

interface Props {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

const sizes = {
  sm: 'w-[150px] sm:w-[170px]',
  md: 'w-[180px] sm:w-[205px]',
  lg: 'w-[220px] sm:w-[250px]',
};

export function MovieCard({ movie, size = 'md', showActions = true }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const inList = useWatchlistStore((s) => s.ids.includes(movie.id));
  const toggle = useWatchlistStore((s) => s.toggle);

  const qualityBadge = [movie.quality || '4K', movie.subtitleType || 'Vietsub'].join(' · ');
  const isSeries = movie.type === 'series';
  const progressBadge = isSeries
    ? `Tập ${movie.episodes?.current || movie.episodes?.total || 1}/${movie.episodes?.total || 1}`
    : `${movie.duration}p`;

  // 3D Tilt & Specular Glossy effect handlers (manipulated directly via ref to comply with 0 inline-style JSX rule)
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    if (glowRef.current) {
      glowRef.current.style.opacity = '1';
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(6, 182, 212, 0.35) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 70%)`;
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  }

  return (
    <div className={`${sizes[size]} flex-shrink-0 select-none group`}>
      <Link to={PATHS.MOVIE_DETAIL(movie.id)} className="block relative">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-surface-2 shadow-poster border border-white/10 transition-transform duration-200 ease-out will-change-transform group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgb(var(--np-primary-rgb)/0.35)]"
        >
          {/* Poster Image */}
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).classList.add('hidden');
            }}
          />

          {/* Interactive Specular Light Glare Overlay */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 mix-blend-screen"
          />

          {/* Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-base" />

          {/* Top Left: 4K & Vietsub Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-tight bg-primary text-white shadow-glow backdrop-blur-md">
              <Sparkles className="w-3 h-3 fill-current" />
              {qualityBadge}
            </span>
          </div>

          {/* Top Right: IMDb Score Pill */}
          <div className="absolute top-2.5 right-2.5 z-10 bg-bg-2/85 backdrop-blur-md border border-white/15 rounded-md px-2 py-0.5 inline-flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-[11px] font-extrabold text-fg">{movie.rating.toFixed(1)}</span>
          </div>

          {/* Bottom Left: Episode / Duration Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-black/70 border border-white/10 backdrop-blur-md rounded-md px-2 py-0.5 text-[11px] font-semibold text-fg-1">
            {progressBadge}
          </div>

          {/* Center: Glowing Pulse Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-base scale-75 group-hover:scale-100">
            <div className="relative">
              <div className="absolute -inset-2 rounded-pill bg-primary/40 blur-md animate-pulse" />
              <div className="relative w-13 h-13 rounded-pill bg-grad-brand text-white grid place-items-center shadow-glow">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Meta Title & Action */}
      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          <Link
            to={PATHS.MOVIE_DETAIL(movie.id)}
            className="block text-sm font-extrabold text-fg truncate hover:text-primary transition-colors leading-snug"
            title={movie.title}
          >
            {movie.title}
          </Link>
          <p className="text-xs text-fg-3 truncate mt-1">
            {movie.originalTitle && movie.originalTitle !== movie.title
              ? `${movie.originalTitle} · ${movie.releaseYear}`
              : `${movie.releaseYear} · ${movie.genres.slice(0, 2).join(', ')}`}
          </p>
        </div>

        {showActions && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(movie.id);
            }}
            aria-label={inList ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
            className="flex-shrink-0 w-8 h-8 grid place-items-center rounded-lg text-fg-3 hover:text-primary hover:bg-white/5 transition-colors"
          >
            {inList ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
