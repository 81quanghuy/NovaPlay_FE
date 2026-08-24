import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  Sparkles,
} from 'lucide-react';
import type { Movie } from '../types';
import { useWatchlistStore } from '../store/watchlistStore';
import { PATHS } from '@/routes/paths';

interface Props {
  movies: Movie[];
}

const AUTOPLAY_INTERVAL = 4500; // 4.5 giây lướt tự động mượt mà

export function HeroSlider({ movies }: Props) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const inList = useWatchlistStore((s) => s.ids.includes(movies[current]?.id ?? ''));
  const toggle = useWatchlistStore((s) => s.toggle);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (movies.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % movies.length);
      }, AUTOPLAY_INTERVAL);
    }
  }, [movies.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  function goTo(index: number) {
    setCurrent(index);
    resetTimer();
  }

  function prev() {
    goTo((current - 1 + movies.length) % movies.length);
  }

  function next() {
    goTo((current + 1) % movies.length);
  }

  return (
    <section
      className="relative w-full h-[78vh] min-h-[580px] max-h-[820px] overflow-hidden select-none"
      aria-label={`Hero banner — ${movie.title}`}
    >
      {/* Backdrop images with smooth crossfade */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={i !== current}
        >
          <img
            src={m.backdrop}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover object-center ${
              i === current ? 'scale-105 transition-transform duration-[6000ms] ease-out' : 'scale-100'
            }`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).classList.add('hidden');
            }}
          />
        </div>
      ))}

      {/* Cinematic Scrim Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 via-bg/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-bg/85 to-transparent" />

      {/* Ambient Spotlight Glow */}
      <div className="absolute top-1/4 left-8 w-80 h-80 bg-primary/20 rounded-pill blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative h-full max-w-container mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-end pb-14 lg:pb-16 pt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Main Info */}
          <div className="max-w-2xl">
            {/* Top Badges / Annotations */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-lg bg-primary text-white shadow-glow">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                {movie.quality || '4K'} · {movie.subtitleType || 'Vietsub'}
              </span>

              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-surface-2/90 border border-gold/40 text-gold inline-flex items-center gap-1 backdrop-blur-md shadow-sm">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                {movie.rating.toFixed(1)}
              </span>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-2/80 border border-white/15 text-fg-2 inline-flex items-center gap-1 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5" />
                {movie.releaseYear}
              </span>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-2/80 border border-white/15 text-fg-2 inline-flex items-center gap-1 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" />
                {movie.duration} phút
              </span>

              {movie.country && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-2/80 border border-white/15 text-fg-2 inline-flex items-center gap-1 backdrop-blur-md">
                  <Globe className="w-3.5 h-3.5" />
                  {movie.country}
                </span>
              )}
            </div>

            {/* Title — Kích thước vừa vặn, chuẩn điện ảnh */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-white mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-fg-3 text-sm sm:text-base italic mb-3 font-semibold">
                {movie.originalTitle}
              </p>
            )}

            {/* Description */}
            <p className="text-fg-2 text-sm sm:text-base leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3 max-w-xl drop-shadow-md">
              {movie.description}
            </p>

            {/* Actions CTA — Thiết kế chỉnh chu, bắt mắt */}
            <div className="flex items-center flex-wrap gap-3">
              <Link
                to={PATHS.WATCH(movie.id)}
                className="inline-flex items-center gap-2 h-11 sm:h-12 px-7 rounded-pill bg-grad-brand text-white font-display font-extrabold text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all duration-fast shadow-[0_0_28px_rgb(var(--np-primary-rgb)/0.55)] border border-white/25"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" /> Xem Phim Ngay
              </Link>
              <Link
                to={PATHS.MOVIE_DETAIL(movie.id)}
                className="inline-flex items-center gap-2 h-11 sm:h-12 px-6 rounded-pill bg-surface-2/90 border border-white/20 backdrop-blur-xl text-fg font-display font-bold text-sm sm:text-base hover:bg-white/15 hover:border-primary/50 hover:shadow-glow active:scale-95 transition-all duration-fast"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5" /> Chi Tiết
              </Link>
              <button
                type="button"
                onClick={() => toggle(movie.id)}
                aria-label={inList ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                className="w-11 h-11 sm:w-12 sm:h-12 grid place-items-center rounded-pill bg-surface-2/90 border border-white/20 backdrop-blur-xl text-fg hover:text-primary hover:border-primary/50 hover:bg-white/15 active:scale-95 transition-all duration-fast shadow-md"
              >
                {inList ? (
                  <BookmarkCheck className="w-5 h-5 text-primary" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Large Poster Preview on Desktop */}
          <div className="hidden lg:block w-[200px] xl:w-[230px] aspect-[2/3] rounded-2xl overflow-hidden bg-surface-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-white/20 ring-1 ring-primary/30 flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Carousel controls with active auto-progress indicators */}
        {movies.length > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {movies.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === current ? 'true' : undefined}
                  className={`rounded-pill transition-all duration-base ${
                    i === current
                      ? 'w-8 h-2 bg-primary shadow-glow'
                      : 'w-2.5 h-2 bg-white/25 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Slide trước"
                className="w-9 h-9 grid place-items-center rounded-pill bg-surface-2/80 border border-white/15 text-fg hover:bg-white/20 hover:border-primary/40 hover:text-primary transition-all duration-fast"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Slide tiếp"
                className="w-9 h-9 grid place-items-center rounded-pill bg-surface-2/80 border border-white/15 text-fg hover:bg-white/20 hover:border-primary/40 hover:text-primary transition-all duration-fast"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
