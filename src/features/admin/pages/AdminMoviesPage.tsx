import { useState } from 'react';
import {
  CheckCircle2,
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { MOVIES } from '@/features/movies/data/movies';
import { movieService } from '@/features/movies/services/movieService';
import type { Movie } from '@/features/movies/types';

export function AdminMoviesPage() {
  const [moviesList, setMoviesList] = useState<Movie[]>(MOVIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);

  // Filtered movies
  const filteredMovies = moviesList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const totalMovies = moviesList.length;
  const seriesCount = moviesList.filter((m) => m.type === 'series').length;
  const publishedCount = moviesList.length; // Tất cả mock data hiện là published

  async function handleDeleteMovie(id: string) {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      await movieService.deleteMovie(id);
      setMoviesList((prev) => prev.filter((m) => m.id !== id));
    }
  }

  function handleOpenCreate() {
    setEditingMovie({
      id: `mov-${Date.now()}`,
      title: '',
      originalTitle: '',
      description: '',
      releaseYear: 2024,
      duration: 120,
      rating: 8.5,
      genres: ['Hành Động'],
      type: 'movie',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200',
      quality: '4K',
      subtitleType: 'Vietsub',
      director: 'Đang cập nhật',
      country: 'Âu Mỹ',
    });
    setEditModalOpen(true);
  }

  function handleOpenEdit(movie: Movie) {
    setEditingMovie({ ...movie });
    setEditModalOpen(true);
  }

  async function handleSaveMovie(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMovie || !editingMovie.title) return;

    const exists = moviesList.some((m) => m.id === editingMovie.id);
    if (exists) {
      await movieService.updateMovie(editingMovie.id!, editingMovie);
      setMoviesList((prev) =>
        prev.map((m) => (m.id === editingMovie.id ? (editingMovie as Movie) : m)),
      );
    } else {
      const created = await movieService.createMovie(editingMovie);
      setMoviesList((prev) => [created as Movie, ...prev]);
    }

    setEditModalOpen(false);
    setEditingMovie(null);
  }

  return (
    <div className="space-y-8 select-none">
      {/* Page Title & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
            Quản Lý Danh Mục Phim
          </h1>
          <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
            Quản lý toàn bộ kho phim, danh sách tập, trạng thái xuất bản và tệp media
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm Phim Mới
        </button>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
          <span className="text-xs font-bold text-fg-3">Tổng số phim</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-fg block mt-1">
            {totalMovies}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
          <span className="text-xs font-bold text-success">Đã xuất bản (Live)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-success block mt-1">
            {publishedCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
          <span className="text-xs font-bold text-primary">Phim bộ (Series)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-primary block mt-1">
            {seriesCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
          <span className="text-xs font-bold text-gold">Chất lượng 4K UHD</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-gold block mt-1">
            100%
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-fg-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên phim, tên gốc..."
            className="w-full bg-surface-2 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-fg outline-none focus:border-primary font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              statusFilter === 'ALL'
                ? 'bg-primary text-white shadow-glow'
                : 'bg-surface-2 border border-white/5 text-fg-3'
            }`}
          >
            Tất Cả
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              statusFilter === 'PUBLISHED'
                ? 'bg-primary text-white shadow-glow'
                : 'bg-surface-2 border border-white/5 text-fg-3'
            }`}
          >
            Đã Phát Hành
          </button>
        </div>
      </div>

      {/* Movies Table */}
      <div className="bg-surface-2 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface border-b border-white/10 text-fg-3 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="p-4 sm:px-6">Phim</th>
                <th className="p-4">Thể Loại</th>
                <th className="p-4">Định Dạng</th>
                <th className="p-4">Năm</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="font-extrabold text-fg truncate block">
                          {movie.title}
                        </span>
                        {movie.originalTitle && (
                          <span className="text-xs text-fg-3 italic truncate block">
                            {movie.originalTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-fg-2">
                    {movie.genres.slice(0, 2).join(', ')}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-fg-2 text-xs font-bold border border-white/10">
                      {movie.type === 'series' ? 'Phim Bộ' : 'Phim Lẻ'}
                    </span>
                  </td>
                  <td className="p-4 text-fg-2 font-mono">{movie.releaseYear}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-success/15 border border-success/30 text-success text-xs font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(movie)}
                        aria-label="Chỉnh sửa phim"
                        className="p-1.5 rounded-lg text-fg-3 hover:text-primary hover:bg-white/5 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMovie(movie.id)}
                        aria-label="Xóa phim"
                        className="p-1.5 rounded-lg text-fg-3 hover:text-danger hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create / Edit Movie Modal ─────────────────────────────────── */}
      {editModalOpen && editingMovie && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chỉnh sửa thông tin phim"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
        >
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setEditModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
          />

          <div className="relative z-10 w-full max-w-2xl bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="font-display font-black text-lg text-fg">
                {editingMovie.title ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="movie-title" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Tên Phim (Tiếng Việt)
                  </label>
                  <input
                    id="movie-title"
                    type="text"
                    required
                    value={editingMovie.title || ''}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, title: e.target.value })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="movie-original-title" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Tên Gốc Quốc Tế
                  </label>
                  <input
                    id="movie-original-title"
                    type="text"
                    value={editingMovie.originalTitle || ''}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        originalTitle: e.target.value,
                      })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="movie-release-year" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Năm Phát Hành
                  </label>
                  <input
                    id="movie-release-year"
                    type="number"
                    value={editingMovie.releaseYear || 2024}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        releaseYear: Number(e.target.value),
                      })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="movie-duration" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Thời Lượng (Phút)
                  </label>
                  <input
                    id="movie-duration"
                    type="number"
                    value={editingMovie.duration || 120}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        duration: Number(e.target.value),
                      })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="movie-type" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Định Dạng
                  </label>
                  <select
                    id="movie-type"
                    value={editingMovie.type || 'movie'}
                    onChange={(e) =>
                      setEditingMovie({
                        ...editingMovie,
                        type: e.target.value as 'movie' | 'series',
                      })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  >
                    <option value="movie">Phim Lẻ (Single Movie)</option>
                    <option value="series">Phim Bộ (Series)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="movie-country" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                    Quốc Gia
                  </label>
                  <input
                    id="movie-country"
                    type="text"
                    value={editingMovie.country || 'Âu Mỹ'}
                    onChange={(e) =>
                      setEditingMovie({ ...editingMovie, country: e.target.value })
                    }
                    className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="movie-description" className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                  Mô Tả / Cốt Truyện
                </label>
                <textarea
                  id="movie-description"
                  rows={3}
                  value={editingMovie.description || ''}
                  onChange={(e) =>
                    setEditingMovie({
                      ...editingMovie,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-surface-2 border border-white/10 rounded-xl p-3 text-sm text-fg outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-fg-3 hover:text-fg transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
