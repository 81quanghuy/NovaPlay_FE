import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { getMovie } from '../data/movies';

export function WatchPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = getMovie(id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-bg text-fg-1 grid place-items-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl mb-2">Không tìm thấy phim</h1>
          <Link to="/movies" className="text-primary-hover font-semibold hover:underline">
            ← Về trang Khám Phá Phim
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg-1 flex flex-col">
      <header className="h-14 px-4 lg:px-8 flex items-center justify-between border-b border-border bg-bg-2/90 backdrop-blur-md sticky top-0 z-30">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 h-9 rounded-pill bg-white/5 border border-border text-sm hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát
        </button>
        <div className="min-w-0 flex-1 mx-4 text-center">
          <p className="text-sm lg:text-base font-display font-bold text-fg truncate">
            {movie.title}
          </p>
          <p className="text-xs text-fg-3 truncate">
            {movie.releaseYear} · {movie.duration} phút · {movie.genres.join(', ')}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-sm">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="font-semibold">{movie.rating.toFixed(1)}</span>
        </div>
      </header>

      <div className="flex-1 grid place-items-center bg-black">
        <div className="w-full max-w-[1600px] aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${movie.youtubeKey}?autoplay=1&modestbranding=1&rel=0`}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>

      <section className="px-4 lg:px-16 py-8 max-w-container mx-auto w-full">
        <h1 className="font-display font-extrabold text-3xl text-fg">{movie.title}</h1>
        {movie.originalTitle && movie.originalTitle !== movie.title && (
          <p className="text-fg-3 italic mt-1">{movie.originalTitle}</p>
        )}
        <p className="text-fg-1 text-base mt-4 max-w-3xl leading-relaxed">{movie.description}</p>
      </section>
    </div>
  );
}
