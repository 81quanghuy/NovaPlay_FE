import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';

interface MovieSliderProps {
  movies: Movie[];
}

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextAnimating, setIsTextAnimating] = useState(false);

  // Smooth auto-advance controller
  const SLIDE_MS = 5000;
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(SLIDE_MS);

  const clearAdvanceTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
    setIsTextAnimating(true);
    setTimeout(() => setIsTextAnimating(false), 400);
  }, [movies.length]);

  const scheduleAdvance = useCallback((delay: number) => {
    clearAdvanceTimeout();
    startTimeRef.current = Date.now();
    timeoutRef.current = window.setTimeout(() => {
      nextSlide();
      remainingRef.current = SLIDE_MS;
      scheduleAdvance(SLIDE_MS);
    }, delay);
  }, [nextSlide]);

  // Auto-advance with pause/resume on hover
  useEffect(() => {
    scheduleAdvance(remainingRef.current);
    return () => clearAdvanceTimeout();
  }, [scheduleAdvance]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Pause auto-advance
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearAdvanceTimeout();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Resume with remaining time
    scheduleAdvance(Math.max(0, remainingRef.current));
  };

  if (!movies.length) return null;

  const lastThumbClickRef = useRef<number>(0);
  const handleThumbnailClick = (index: number) => {
    const now = Date.now();
    if (now - lastThumbClickRef.current < 200) return; // debounce rapid clicks
    lastThumbClickRef.current = now;
    setCurrentIndex(index);
    setIsTextAnimating(true);
    setTimeout(() => setIsTextAnimating(false), 400);
    remainingRef.current = SLIDE_MS;
    scheduleAdvance(SLIDE_MS);
  };

  // Preload next backdrop image for smoother transitions
  useEffect(() => {
    if (!movies.length) return;
    const next = movies[(currentIndex + 1) % movies.length];
    const img = new Image();
    img.src = next.backdropUrl;
  }, [currentIndex, movies]);

  const movie = movies[currentIndex];

  return (
    <div className="relative">
      {/* Main Slider */}
      <div
        className="group relative h-[500px] overflow-hidden rounded-lg md:h-[760px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-in-out group-hover:scale-110"
          style={{
            backgroundImage: `url(${movie.backdropUrl})`,
          }}
        >
          <div className="absolute left-0 top-0 h-full w-1/5 pointer-events-none bg-gradient-to-r from-[#1b1e27] via-transparent to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-1/5 pointer-events-none bg-gradient-to-l from-[#1b1e27] via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/4 pointer-events-none bg-gradient-to-t from-[#1b1e27] via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-1/6 pointer-events-none bg-gradient-to-b from-[#1b1e27] via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 w-full">
            <div className={`max-w-2xl space-y-6 bg-black/60 rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-500
              ${isTextAnimating ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}
            >
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-red-500/70 px-3 py-1 text-sm font-medium text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-white md:text-6xl">
                {movie.title}
              </h1>

              {/* Movie Info */}
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-500" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{movie.duration} phút</span>
                </div>
                <span className="rounded bg-red-500/70 px-2 py-1 text-sm font-medium text-white">
                  {movie.quality}
                </span>
              </div>

              {/* Overview */}
              <p className="text-lg text-gray-300 line-clamp-3">{movie.overview}</p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/phim/${movie.id}`}
                  className="flex items-center gap-2 rounded-full bg-red-500 px-8 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Xem Phim
                </Link>
                <Link
                  to={`/phim/${movie.id}`}
                  className="flex items-center gap-2 rounded-full border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thumbnails */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex gap-2">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 transition duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
            >
              <div className="relative h-16 w-28 overflow-hidden rounded">
                <img
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
                <div className={`absolute inset-0 ${index === currentIndex ? 'bg-transparent ring-2 ring-red-500' : 'bg-black/40'
                  }`}></div>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-gray-600 ${index === currentIndex ? 'block' : 'hidden'
                }`}>
                <div
                  className="h-full w-full bg-red-500 animate-progress origin-left"
                  style={{ animationPlayState: isHovered ? 'paused' as const : 'running' as const }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSlider; 