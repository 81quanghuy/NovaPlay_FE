import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Calendar, Clock, Play, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/features/auth/components/Button';
import { MovieRow } from '../components/MovieRow';
import { MOVIES, getMovie } from '../data/movies';
import { useWatchlistStore } from '../store/watchlistStore';

export function MovieDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = getMovie(id);
  const inList = useWatchlistStore((s) => s.ids.includes(id));
  const toggle = useWatchlistStore((s) => s.toggle);

  if (!movie) {
    return (
      <div className="min-h-screen bg-bg text-fg-1">
        <Navbar />
        <div className="max-w-container mx-auto px-6 py-24 text-center">
          <h1 className="font-display font-bold text-3xl text-fg mb-3">Không tìm thấy phim</h1>
          <p className="text-fg-2 mb-6">Phim bạn yêu cầu không tồn tại hoặc đã bị gỡ.</p>
          <Link to="/movies" className="text-primary-hover font-semibold hover:underline">
            ← Về trang Khám Phá Phim
          </Link>
        </div>
      </div>
    );
  }

  const related = MOVIES.filter(
    (m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)),
  ).slice(0, 12);

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <Navbar />

      <section
        className="relative h-[520px] lg:h-[640px] w-full overflow-hidden"
        style={{
          backgroundImage: `url(${movie.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-grad-hero-left" />
        <div className="absolute inset-0 bg-grad-hero-bottom" />
        <div className="relative max-w-container mx-auto h-full px-6 lg:px-16 flex flex-col justify-end pb-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="self-start mb-6 inline-flex items-center gap-2 px-3 h-9 rounded-pill bg-white/5 border border-border text-sm text-fg-1 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2 mb-3">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 bg-white/5 border border-border rounded-pill text-xs font-semibold text-fg-1"
              >
                {g}
              </span>
            ))}
          </div>
          <h1 className="font-display font-extrabold text-4xl lg:text-6xl leading-[1.05] tracking-tight text-fg max-w-3xl">
            {movie.title}
          </h1>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-fg-3 mt-2 italic">{movie.originalTitle}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-fg-2">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-fg-1 font-semibold">{movie.rating.toFixed(1)}</span>/10
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {movie.releaseYear}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {movie.duration} phút
            </span>
          </div>
          <p className="text-fg-1 text-base lg:text-lg mt-5 max-w-3xl leading-relaxed">
            {movie.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Button
              variant="primary"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => navigate(`/watch/${movie.id}`)}
            >
              Xem Ngay
            </Button>
            <Button
              variant="secondary"
              leftIcon={
                inList ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )
              }
              onClick={() => toggle(movie.id)}
            >
              {inList ? 'Đã Yêu Thích' : 'Thêm Vào Yêu Thích'}
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-2xl text-fg mb-4">Trình Chiếu</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-bg-2 shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${movie.youtubeKey}`}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
          <aside className="bg-surface border border-border rounded-xl p-6 h-fit">
            <h3 className="font-display font-bold text-lg text-fg mb-4">Thông Tin</h3>
            <dl className="space-y-3 text-sm">
              {movie.director && (
                <div>
                  <dt className="text-fg-3">Đạo diễn</dt>
                  <dd className="text-fg-1 font-medium mt-0.5">{movie.director}</dd>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <dt className="text-fg-3">Diễn viên</dt>
                  <dd className="text-fg-1 font-medium mt-0.5">{movie.cast.join(', ')}</dd>
                </div>
              )}
              <div>
                <dt className="text-fg-3">Thời lượng</dt>
                <dd className="text-fg-1 font-medium mt-0.5">{movie.duration} phút</dd>
              </div>
              <div>
                <dt className="text-fg-3">Năm phát hành</dt>
                <dd className="text-fg-1 font-medium mt-0.5">{movie.releaseYear}</dd>
              </div>
              <div>
                <dt className="text-fg-3">Điểm IMDb</dt>
                <dd className="text-fg-1 font-medium mt-0.5 inline-flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  {movie.rating.toFixed(1)}/10
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {related.length > 0 && (
          <MovieRow title="Có Thể Bạn Sẽ Thích" movies={related} />
        )}
      </section>
    </div>
  );
}
