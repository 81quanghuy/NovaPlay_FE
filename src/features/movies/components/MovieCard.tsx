import { Link } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck, Play } from 'lucide-react';
import type { Movie } from '../data/movies';
import { useWatchlistStore } from '../store/watchlistStore';

interface Props {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

const sizes = {
  sm: 'w-[140px]',
  md: 'w-[180px]',
  lg: 'w-[220px]',
};

export function MovieCard({ movie, size = 'md', showActions = true }: Props) {
  const inList = useWatchlistStore((s) => s.ids.includes(movie.id));
  const toggle = useWatchlistStore((s) => s.toggle);

  return (
    <div className={`${sizes[size]} flex-shrink-0 group`}>
      <Link to={`/movie/${movie.id}`} className="block relative">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-2 shadow-poster">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-base ease-np-out group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
          <div className="absolute top-2 right-2 bg-bg-2/85 backdrop-blur-sm rounded-md px-1.5 py-0.5 inline-flex items-center gap-1">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-xs font-semibold text-fg">{movie.rating.toFixed(1)}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-base">
            <div className="w-12 h-12 rounded-pill bg-primary/90 backdrop-blur grid place-items-center shadow-glow">
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-2.5 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <Link
            to={`/movie/${movie.id}`}
            className="block text-sm font-semibold text-fg-1 truncate hover:text-primary-hover"
          >
            {movie.title}
          </Link>
          <p className="text-xs text-fg-3 truncate mt-0.5">
            {movie.releaseYear} · {movie.genres[0]}
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
            className="flex-shrink-0 w-7 h-7 grid place-items-center rounded-md text-fg-2 hover:text-primary-hover hover:bg-white/5 transition-colors"
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
