import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Flag,
  Lightbulb,
  LightbulbOff,
  RotateCcw,
  Server,
  Share2,
  Sparkles,
  Star,
  Tv,
} from 'lucide-react';
import { getMovie, MOVIES } from '../data/movies';
import { MovieRow } from '../components/MovieRow';
import { MovieReviews } from '../components/MovieReviews';
import { ShareMovieCardModal } from '../components/ShareMovieCardModal';
import { useWatchlistStore } from '../store/watchlistStore';
import { useHistoryStore } from '../store/historyStore';
import { PATHS } from '@/routes/paths';
import { UI } from '@/config';

const SERVERS = [
  { id: 'vip1', label: 'Server #1 (VIP 4K Ultra HD)', desc: 'Tốc độ cao nhất, âm thanh 5.1' },
  { id: 'backup2', label: 'Server #2 (Dự Phòng FHD)', desc: 'Ổn định khi mạng yếu' },
] as const;

export function WatchPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = getMovie(id);
  const inList = useWatchlistStore((s) => s.ids.includes(id));
  const toggle = useWatchlistStore((s) => s.toggle);
  const saveProgress = useHistoryStore((s) => s.saveProgress);

  const [activeServer, setActiveServer] = useState<string>('vip1');
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [lightsOff, setLightsOff] = useState<boolean>(false);
  const [reported, setReported] = useState(false);
  const [playerKey, setPlayerKey] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState(false);

  // Auto scroll to top on movie ID change and save to history
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (id) {
      saveProgress(id, selectedEpisode, 45); // Tự động ghi nhận tiến độ vào Lịch sử xem
    }
  }, [id, selectedEpisode, saveProgress]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-bg text-fg-1 grid place-items-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl mb-2">Không tìm thấy phim</h1>
          <Link to={PATHS.MOVIES} className="text-primary font-semibold hover:underline">
            ← Về trang Khám Phá Phim
          </Link>
        </div>
      </div>
    );
  }

  const isSeries = movie.type === 'series';
  const related = MOVIES.filter(
    (m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)),
  ).slice(0, UI.RELATED_MOVIES_LIMIT);

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${lightsOff ? 'bg-black text-fg-2' : 'bg-bg text-fg-1'}`}>
      {/* Watch Page Header Bar */}
      <header
        className={`h-16 px-4 lg:px-8 flex items-center justify-between border-b transition-all duration-500 sticky top-0 z-50 ${
          lightsOff
            ? 'bg-black/95 border-white/5 opacity-30 hover:opacity-100'
            : 'border-border bg-bg-2/95 backdrop-blur-md'
        }`}
      >
        <button
          type="button"
          onClick={() => navigate(PATHS.MOVIE_DETAIL(movie.id))}
          className="inline-flex items-center gap-2 px-3.5 h-9 rounded-pill bg-white/5 border border-border text-sm hover:bg-white/10 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Chi tiết phim
        </button>

        <div className="min-w-0 flex-1 mx-4 text-center">
          <p className="text-sm sm:text-base font-display font-extrabold text-fg truncate">
            {movie.title}
            {isSeries && ` — Tập ${selectedEpisode}`}
          </p>
          <p className="text-xs text-fg-3 truncate">
            {movie.quality || '4K'} · {movie.subtitleType || 'Vietsub'} · {movie.releaseYear}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Nút Tắt Đèn / Bật Đèn */}
          <button
            type="button"
            onClick={() => setLightsOff((v) => !v)}
            title={lightsOff ? 'Bật đèn giao diện' : 'Tắt đèn rạp chiếu (Lights Off)'}
            className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-pill text-xs font-bold transition-all ${
              lightsOff
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white/5 border border-border text-fg-2 hover:text-fg hover:bg-white/10'
            }`}
          >
            {lightsOff ? <Lightbulb className="w-3.5 h-3.5" /> : <LightbulbOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{lightsOff ? 'Bật Đèn' : 'Tắt Đèn'}</span>
          </button>

          {/* Nút Chia Sẻ Thẻ Phim */}
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            title="Chia sẻ thẻ phim"
            className="w-9 h-9 grid place-items-center rounded-pill bg-white/5 border border-border text-fg hover:text-gold hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => toggle(movie.id)}
            aria-label={inList ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
            className="w-9 h-9 grid place-items-center rounded-pill bg-white/5 border border-border text-fg hover:text-primary transition-colors"
          >
            {inList ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-gold bg-white/5 border border-white/10 rounded-pill px-2.5 py-1">
            <Star className="w-4 h-4 fill-gold" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </header>

      {/* IMAX Video Player Area with Ambilight Effect */}
      <div className="relative py-4 sm:py-8 overflow-hidden">
        {/* Dynamic Ambilight Background Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 blur-3xl scale-110">
          <img
            src={movie.backdrop || movie.poster}
            alt=""
            className="w-full max-w-[1400px] h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-2 sm:px-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
            <iframe
              key={playerKey}
              src={`https://www.youtube.com/embed/${movie.youtubeKey}?autoplay=1&modestbranding=1&rel=0`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Controls & Server Bar */}
      <div className={`border-b transition-all duration-500 py-4 px-4 sm:px-6 lg:px-8 ${lightsOff ? 'bg-black/90 border-white/5 opacity-40 hover:opacity-100' : 'bg-surface-2/70 border-border'}`}>
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Server Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-fg-3 inline-flex items-center gap-1 mr-1">
              <Server className="w-3.5 h-3.5 text-primary" /> Nguồn phát:
            </span>
            {SERVERS.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setActiveServer(srv.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-fast ${
                  activeServer === srv.id
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface-3/80 text-fg-2 hover:text-fg hover:bg-surface-3 border border-white/5'
                }`}
              >
                {srv.label}
              </button>
            ))}
          </div>

          {/* Player utility actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlayerKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-fg-2 hover:text-primary hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Tải lại player
            </button>

            <button
              type="button"
              onClick={() => setReported(true)}
              disabled={reported}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-fg-2 hover:text-danger hover:bg-white/10 transition-colors disabled:opacity-60"
            >
              <Flag className="w-3.5 h-3.5" /> {reported ? 'Đã báo lỗi' : 'Báo lỗi phim'}
            </button>
          </div>
        </div>
      </div>

      {/* Episode list, Synopsis, and Community Reviews */}
      <section className={`px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full flex-1 transition-opacity duration-500 ${lightsOff ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
        {/* Episodes Section with Card Grid */}
        {isSeries && movie.episodes && movie.episodes.total > 0 && (
          <div className="bg-surface/90 border border-white/8 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-pill bg-primary/20 text-primary grid place-items-center shadow-glow">
                  <Tv className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-fg">
                    Danh Sách Tập Phim
                  </h3>
                  <p className="text-xs text-fg-3">
                    Đang chiếu Tập {selectedEpisode} · Tổng số {movie.episodes.total} tập
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Array.from({ length: movie.episodes.total }, (_, i) => {
                const epNumber = i + 1;
                const isSelected = selectedEpisode === epNumber;
                const isWatched = epNumber < selectedEpisode;

                return (
                  <button
                    key={epNumber}
                    type="button"
                    onClick={() => setSelectedEpisode(epNumber)}
                    className={`h-12 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-fast ${
                      isSelected
                        ? 'bg-primary text-white shadow-glow border-transparent'
                        : 'bg-surface-2/90 border border-white/10 text-fg-2 hover:bg-white/10 hover:text-fg hover:border-primary/40'
                    }`}
                  >
                    {isWatched && !isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary/70" />
                    )}
                    Tập {epNumber}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Synopsis & Info Summary */}
        <div className="bg-surface/80 border border-white/8 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-fg">
              {movie.title}
            </h1>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-bold px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" />
              {movie.quality || '4K'} · {movie.subtitleType || 'Vietsub'} · {movie.duration} phút
            </span>
          </div>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-fg-3 italic text-sm mb-3 font-medium">{movie.originalTitle}</p>
          )}

          <p className="text-fg-2 text-sm sm:text-base leading-relaxed max-w-4xl">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-pill text-xs font-semibold bg-white/5 border border-white/10 text-fg-2"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Community Reviews & Discussions */}
        <div className="mb-8">
          <MovieReviews movieId={movie.id} movieTitle={movie.title} />
        </div>

        {/* Related movies */}
        {related.length > 0 && (
          <div className="mt-8">
            <MovieRow title="Đề Xuất Xem Tiếp Cho Bạn" movies={related} />
          </div>
        )}
      </section>

      {/* Share Movie Story Card Modal */}
      <ShareMovieCardModal
        movie={movie}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
