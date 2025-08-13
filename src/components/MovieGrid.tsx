import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { Play, Info, Heart } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
}

const MOVIES_PER_PAGE = 7;
const ITEM_WIDTH = 160 + 16; // w-40 + gap-4

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);
  const isDragging = useRef(false);
  const hoverTimerRef = useRef<number | null>(null);

  // Xử lý nút mũi tên
  const handleNext = () => {
    if (startIndex + MOVIES_PER_PAGE < movies.length) {
      setStartIndex(startIndex + 1);
    }
  };
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Xử lý kéo chuột
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    isDragging.current = true;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    if (dragDelta.current < -50 && startIndex + MOVIES_PER_PAGE < movies.length) {
      setStartIndex(startIndex + 1);
    } else if (dragDelta.current > 50 && startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
    isDragging.current = false;
    dragStartX.current = null;
    dragDelta.current = 0;
  };

  // Xử lý cuộn chuột ngang
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 10) {
      const moveCount = Math.round(e.deltaX / ITEM_WIDTH);
      let newStart = startIndex + moveCount;
      if (newStart < 0) newStart = 0;
      if (newStart > movies.length - MOVIES_PER_PAGE) newStart = movies.length - MOVIES_PER_PAGE;
      setStartIndex(newStart);
    }
  };

  // Tính toán các phim hiển thị (luôn lấy đủ MOVIES_PER_PAGE phim, nếu cuối thì lấy từ cuối lên)
  let visibleMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  if (visibleMovies.length < MOVIES_PER_PAGE) {
    visibleMovies = movies.slice(-MOVIES_PER_PAGE);
  }

  // Animation: translateX
  const translateX = -startIndex * ITEM_WIDTH;

  return (
    <div className="relative select-none">
      {/* Nút mũi tên trái */}
      {startIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg"
          onClick={handlePrev}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      {/* Nút mũi tên phải */}
      {startIndex + MOVIES_PER_PAGE < movies.length && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg"
          onClick={handleNext}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
      <div
        className="px-8"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {movies.map((movie) => {
            const id = movie.id.toString();
            const isActive = hovered === id;
            const isModalOpen = activeModalId === id;
            const isDimmed = isModalOpen; // chỉ làm mờ chính phim đang mở modal
            return (
              <div
                key={movie.id}
                className={`group relative flex-shrink-0 w-40 sm:w-44 md:w-48 overflow-visible rounded-[20px] transition-opacity duration-200 ${isDimmed ? 'opacity-60' : 'opacity-100'} transition-transform will-change-transform hover:scale-105 hover:z-20 cursor-pointer`}
                onMouseEnter={() => {
                  setHovered(id);
                  if (hoverTimerRef.current) {
                    window.clearTimeout(hoverTimerRef.current);
                  }
                  hoverTimerRef.current = window.setTimeout(() => {
                    setActiveModalId(id);
                  }, 1000);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setActiveModalId(null);
                  if (hoverTimerRef.current) {
                    window.clearTimeout(hoverTimerRef.current);
                    hoverTimerRef.current = null;
                  }
                }}
              >
                {/* Poster Image */}
                <div className="aspect-[2/3] w-full rounded-[20px] overflow-hidden shadow-lg relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-300 rounded-[20px]"
                  />
                  {/* Điểm đánh giá góc trái trên */}
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full text-yellow-400 text-xs font-bold">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {movie.rating?.toFixed(1)}
                  </div>
                  {/* Thể loại góc phải trên */}
                  <div className="absolute top-2 right-2 z-20 flex justify-end">
                    {movie.genres && movie.genres[0] && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">{movie.genres[0]}</span>
                    )}
                  </div>
                </div>
                {/* Hover actions inside poster */}
                <div className={`absolute inset-0 z-10 flex flex-col justify-end rounded-[20px] bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="px-3 pb-3">
                    <h3 className="text-base font-bold text-white mb-1 truncate">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-200 mb-2">
                      {movie.year && <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20">{movie.year}</span>}
                      {movie.quality && <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20">{movie.quality}</span>}
                      {movie.genres && movie.genres[0] && <span className="px-2 py-0.5 rounded bg-red-500 text-white border border-red-400/40">{movie.genres[0]}</span>}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/phim/${movie.id}`} className="flex-1 flex items-center justify-center gap-1 rounded bg-yellow-400 text-black font-semibold py-1 text-sm hover:bg-yellow-500 transition">
                        <Play size={18} /> Xem ngay
                      </Link>
                      <Link to={`/phim/${movie.id}`} className="flex items-center gap-1 rounded bg-white/10 text-white px-3 py-1 text-sm hover:bg-white/20 transition">
                        <Info size={16} /> Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Delayed modal after ~1s hover */}
                {activeModalId === movie.id.toString() && (
                  <div
                    className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[85vw] bg-[#23263a]/95 rounded-2xl shadow-2xl flex flex-col items-center justify-start pointer-events-auto border border-white/10 backdrop-blur-sm transition-all duration-200"
                    style={{ opacity: 1 }}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-48 h-68 object-cover rounded-xl mt-4 shadow-lg border-4 border-white/10"
                    />
                    <div className="mt-3 text-center w-full px-4">
                      <div className="text-xl font-bold text-white leading-tight truncate">{movie.title}</div>
                      <div className="text-sm text-gray-300 truncate">{movie.originalTitle}</div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-4">
                      <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">IMDb {movie.rating?.toFixed(1)}</span>
                      {movie.year && (
                        <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{movie.year}</span>
                      )}
                      {movie.quality && (
                        <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{movie.quality}</span>
                      )}
                      {movie.duration && (
                        <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{Math.round(movie.duration / 60)}h {movie.duration % 60}m</span>
                      )}
                      {movie.genres && movie.genres[0] && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">{movie.genres[0]}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center mt-2 px-4">
                      {movie.tags?.map((tag) => (
                        <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-100 border border-white/20">{tag}</span>
                      ))}
                      {movie.season && (
                        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-100 border border-white/20">Phần {movie.season}</span>
                      )}
                      {movie.episodes && (
                        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-100 border border-white/20">Tập {movie.episodes.current}/{movie.episodes.total}</span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-5 w-full justify-center px-4 pb-4">
                      <Link to={`/phim/${movie.id}`} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-5 py-2 shadow transition text-base">
                        <Play size={20} /> Xem ngay
                      </Link>
                      <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 shadow transition text-base">
                        <Heart size={18} /> Thích
                      </button>
                      <Link to={`/phim/${movie.id}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 shadow transition text-base">
                        <Info size={18} /> Chi tiết
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieGrid; 