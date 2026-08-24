import { useState } from 'react';
import { Clapperboard, Edit, Plus, Trash2, X } from 'lucide-react';
import { GENRES, type Genre } from '@/features/movies/types';

export function AdminGenresPage() {
  const [genresList, setGenresList] = useState<Genre[]>([...GENRES]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    if (editingGenre) {
      setGenresList((prev) =>
        prev.map((g) => (g === editingGenre ? (newGenreName.trim() as Genre) : g)),
      );
    } else {
      setGenresList((prev) => [...prev, newGenreName.trim() as Genre]);
    }

    setModalOpen(false);
    setNewGenreName('');
    setEditingGenre(null);
  }

  function handleDelete(genre: Genre) {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thể loại "${genre}"?`)) {
      setGenresList((prev) => prev.filter((g) => g !== genre));
    }
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
            Quản Lý Thể Loại Phim
          </h1>
          <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
            Danh mục thể loại phim phục vụ lọc và phân loại trên toàn hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGenre(null);
            setNewGenreName('');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm Thể Loại Mới
        </button>
      </div>

      {/* Genres Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genresList.map((genre) => (
          <div
            key={genre}
            className="p-5 rounded-2xl bg-surface-2 border border-white/10 hover:border-primary/40 hover:shadow-glow transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary grid place-items-center flex-shrink-0">
                <Clapperboard className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-fg">{genre}</span>
            </div>

            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => {
                  setEditingGenre(genre);
                  setNewGenreName(genre);
                  setModalOpen(true);
                }}
                aria-label={`Sửa thể loại ${genre}`}
                className="p-1.5 rounded-lg text-fg-3 hover:text-primary hover:bg-white/5 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(genre)}
                aria-label={`Xóa thể loại ${genre}`}
                className="p-1.5 rounded-lg text-fg-3 hover:text-danger hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thêm hoặc sửa thể loại"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
        >
          <button
            type="button"
            aria-label="Đóng modal"
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
          />

          <div className="relative z-10 w-full max-w-md bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-display font-black text-base text-fg">
                {editingGenre ? 'Sửa Thể Loại' : 'Thêm Thể Loại Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                  Tên Thể Loại
                </label>
                <input
                  type="text"
                  required
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  placeholder="VD: Viễn Tây, Nhạc Kịch..."
                  className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-fg-3 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-grad-brand text-white font-black text-xs shadow-glow"
                >
                  {editingGenre ? 'Cập Nhật' : 'Tạo Thể Loại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
