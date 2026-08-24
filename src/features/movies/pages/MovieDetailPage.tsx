import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Film,
  Globe,
  Home,
  Play,
  Share2,
  Sparkles,
  Star,
  Tv,
  Users,
  Video,
  X,
} from 'lucide-react';
import { UI } from '@/config';
import { PATHS } from '@/routes/paths';
import { MovieRow } from '../components/MovieRow';
import { MovieReviews } from '../components/MovieReviews';
import { ShareMovieCardModal } from '../components/ShareMovieCardModal';
import { MOVIES, getMovie } from '../data/movies';
import { useWatchlistStore } from '../store/watchlistStore';

export function MovieDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = getMovie(id);
  const inList = useWatchlistStore((s) => s.ids.includes(id));
  const toggle = useWatchlistStore((s) => s.toggle);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Auto scroll to top when movie ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  // Handle ESC key to close trailer modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setTrailerOpen(false);
    }
    if (trailerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trailerOpen]);

  if (!movie) {
    return (
      <div className="min-h-[60vh] bg-bg text-fg-1 flex flex-col items-center justify-center px-6 py-24">
        <h1 className="font-display font-black text-3xl text-fg mb-3">Không tìm thấy phim</h1>
        <p className="text-fg-2 mb-6">Phim bạn yêu cầu không tồn tại hoặc đã bị gỡ.</p>
        <Link to={PATHS.MOVIES} className="text-primary font-bold hover:underline">
          ← Về trang Khám Phá Phim
        </Link>
      </div>
    );
  }

  const isSeries = movie.type === 'series';
  const related = MOVIES.filter(
    (m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)),
  ).slice(0, UI.RELATED_MOVIES_LIMIT);

  return (
    <div className="min-h-screen bg-bg text-fg-1 pb-16 select-none">
      {/* Ambient Backdrop Hero Background */}
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-35 scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).classList.add('hidden');
          }}
        />
        {/* Scrim Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-bg/90 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 -mt-64 sm:-mt-80 lg:-mt-96 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-fg-3 mb-6 flex-wrap">
          <Link to={PATHS.HOME} className="hover:text-primary transition-colors inline-flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-fg-3" />
          <Link
            to={`${PATHS.MOVIES}?type=${isSeries ? 'series' : 'movie'}`}
            className="hover:text-primary transition-colors font-medium"
          >
            {isSeries ? 'Phim Bộ' : 'Phim Lẻ'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-fg-3" />
          <span className="text-fg-1 font-bold truncate max-w-[200px] sm:max-w-xs">{movie.title}</span>
        </nav>

        {/* 2-Column RoPhim Showcase */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Poster + Main Actions ────────────────────── */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col items-center lg:items-stretch">
            {/* Poster Card */}
            <div className="relative w-[240px] sm:w-[280px] lg:w-full aspect-[2/3] rounded-3xl overflow-hidden bg-surface-2 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 ring-1 ring-white/10 group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Quality & Subtitle Pill on Poster */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black bg-primary text-white shadow-glow backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  {movie.quality || '4K'} · {movie.subtitleType || 'Vietsub'}
                </span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="w-full max-w-[280px] lg:max-w-none mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => navigate(PATHS.WATCH(movie.id))}
                className="w-full h-12 rounded-xl bg-grad-brand text-white font-display font-black text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_28px_rgb(var(--np-primary-rgb)/0.55)] border border-white/20"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" /> Xem Phim Ngay
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="h-10 rounded-xl bg-surface-2 border border-white/15 hover:border-primary/50 text-fg font-bold text-xs inline-flex items-center justify-center gap-1 hover:bg-white/10 active:scale-95 transition-all shadow-md"
                >
                  <Video className="w-3.5 h-3.5 text-primary" /> Trailer
                </button>

                <button
                  type="button"
                  onClick={() => toggle(movie.id)}
                  className="h-10 rounded-xl bg-surface-2 border border-white/15 hover:border-primary/50 text-fg font-bold text-xs inline-flex items-center justify-center gap-1 hover:bg-white/10 active:scale-95 transition-all shadow-md"
                >
                  {inList ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> Đã Lưu
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-fg-3" /> Yêu Thích
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="h-10 rounded-xl bg-surface-2 border border-white/15 hover:border-primary/50 text-fg font-bold text-xs inline-flex items-center justify-center gap-1 hover:bg-white/10 active:scale-95 transition-all shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5 text-gold" /> Chia Sẻ
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Column: Movie Info & Specifications ────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-fg leading-tight mb-2 tracking-tight">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-fg-3 text-base sm:text-xl italic font-semibold mb-4">
                {movie.originalTitle}
              </p>
            )}

            {/* Metrics & Badges Strip */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-black shadow-sm">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span>{movie.rating.toFixed(1)}</span>
                <span className="text-[11px] text-gold/80 font-normal">IMDb</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/10 text-fg-2 text-xs sm:text-sm font-semibold">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {movie.releaseYear}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/10 text-fg-2 text-xs sm:text-sm font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary" /> {movie.duration} phút
              </span>

              {movie.country && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/10 text-fg-2 text-xs sm:text-sm font-semibold">
                  <Globe className="w-3.5 h-3.5 text-primary" /> {movie.country}
                </span>
              )}

              {typeof movie.viewCount === 'number' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/10 text-fg-2 text-xs sm:text-sm font-semibold">
                  <Eye className="w-3.5 h-3.5 text-primary" /> {movie.viewCount.toLocaleString()} lượt xem
                </span>
              )}
            </div>

            {/* Synopsis / Description */}
            <div className="bg-surface/85 border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 backdrop-blur-md shadow-xl">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-fg mb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" /> Nội Dung Phim
              </h2>
              <p className="text-fg-1 text-sm sm:text-base leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Specifications 2-Column Table */}
            <div className="bg-surface/85 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-fg mb-4 pb-3 border-b border-white/10">
                Thông Tin Chi Tiết
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-8 text-xs sm:text-sm">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="text-fg-3">Đạo diễn:</span>
                  <span className="text-fg font-bold text-right">{movie.director || 'Đang cập nhật'}</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="text-fg-3">Quốc gia:</span>
                  <span className="text-fg font-bold text-right">{movie.country || 'Quốc tế'}</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="text-fg-3">Thời lượng:</span>
                  <span className="text-fg font-bold text-right">{movie.duration} phút</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="text-fg-3">Trạng thái:</span>
                  <span className="text-primary font-bold text-right">
                    {isSeries ? `Tập ${movie.episodes?.current || movie.episodes?.total || 1}/${movie.episodes?.total || 1} Vietsub` : 'Hoàn tất Full HD / 4K'}
                  </span>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-1">
                  <span className="text-fg-3">Thể loại:</span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {movie.genres.map((g) => (
                      <Link
                        key={g}
                        to={`${PATHS.MOVIES}?genre=${encodeURIComponent(g)}`}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-2 border border-white/10 text-fg-1 hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Series Episodes Grid (if series) */}
            {isSeries && movie.episodes && movie.episodes.total > 0 && (
              <div className="bg-surface/85 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-fg flex items-center gap-2">
                    <Tv className="w-4 h-4 text-primary" /> Danh Sách Tập Phim
                  </h2>
                  <span className="text-xs text-fg-3">
                    {movie.episodes.seasons} Mùa · {movie.episodes.total} Tập
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                  {Array.from({ length: movie.episodes.total }, (_, i) => {
                    const ep = i + 1;
                    return (
                      <button
                        key={ep}
                        type="button"
                        onClick={() => navigate(PATHS.WATCH(movie.id))}
                        className="h-10 rounded-xl bg-surface-2 border border-white/10 text-xs sm:text-sm font-bold text-fg hover:bg-primary hover:border-primary hover:text-white hover:shadow-glow transition-all duration-fast"
                      >
                        Tập {ep}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cast & Characters Section */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-surface/85 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 backdrop-blur-md shadow-xl">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-fg mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Dàn Diễn Viên & Nhân Vật
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {movie.cast.map((actor) => (
                    <div
                      key={actor}
                      className="bg-surface-2 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-pill bg-primary/20 border border-primary/30 text-primary font-black grid place-items-center flex-shrink-0 text-sm shadow-sm">
                        {actor[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-fg truncate">{actor}</p>
                        <p className="text-[11px] text-fg-3 truncate">Diễn viên chính</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Community Reviews & Discussions */}
            <MovieReviews movieId={movie.id} movieTitle={movie.title} />
          </div>
        </div>

        {/* Related Movies Section */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10">
            <MovieRow title="Có Thể Bạn Cũng Thích" movies={related} />
          </div>
        )}
      </div>

      {/* ── Trailer Video Popup Modal ─────────────────────────────────── */}
      {trailerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Trailer: ${movie.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Accessible Backdrop Button */}
          <button
            type="button"
            aria-label="Đóng Trailer"
            onClick={() => setTrailerOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl cursor-default"
          />

          <div className="relative z-10 w-full max-w-4xl bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-2">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                <h3 className="font-display font-extrabold text-base text-fg truncate">
                  Trailer: {movie.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                aria-label="Đóng Trailer"
                className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${movie.youtubeKey}?autoplay=1&rel=0`}
                title={`Trailer: ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Share Movie Story Card Modal ─────────────────────────────── */}
      <ShareMovieCardModal
        movie={movie}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
