import React from 'react';
import { useParams } from 'react-router-dom';
import { mockMovies } from '../data/mockMovies';
import { Play, Heart, Info } from 'lucide-react';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams();
  const movie = mockMovies.find((m) => m.id.toString() === id);

  if (!movie) return <div className="text-center text-red-500 py-20">Không tìm thấy phim!</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
      {/* Poster */}
      <div className="flex-shrink-0">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-64 h-96 object-cover rounded-2xl shadow-lg border-4 border-white/10"
        />
      </div>
      {/* Thông tin phim */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
          <h2 className="text-lg text-gray-300 mb-4">{movie.originalTitle}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">IMDb {movie.rating?.toFixed(1)}</span>
            {movie.year && (
              <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{movie.year}</span>
            )}
            {movie.quality && (
              <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{movie.quality}</span>
            )}
            {movie.duration && (
              <span className="bg-white/10 text-white text-xs font-semibold px-2 py-1 rounded">{Math.round(movie.duration/60)}h {movie.duration%60}m</span>
            )}
            {movie.genres && movie.genres[0] && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">{movie.genres[0]}</span>
            )}
          </div>
          <p className="text-gray-200 mb-4 whitespace-pre-line">{movie.overview}</p>
          <div className="flex flex-wrap gap-2 mb-4">
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
        </div>
        {/* Nút hành động */}
        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-6 py-2 shadow transition text-base">
            <Play size={20} /> Xem ngay
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-5 py-2 shadow transition text-base">
            <Heart size={18} /> Thích
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-5 py-2 shadow transition text-base">
            <Info size={18} /> Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage; 