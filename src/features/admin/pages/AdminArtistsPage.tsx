import { useState } from 'react';
import { Edit, Plus, Trash2, Users, X } from 'lucide-react';

interface Artist {
  id: string;
  fullName: string;
  role: 'Đạo diễn' | 'Diễn viên';
  avatarLetter: string;
  nationality: string;
}

const INITIAL_ARTISTS: Artist[] = [
  { id: '1', fullName: 'Christopher Nolan', role: 'Đạo diễn', avatarLetter: 'N', nationality: 'Anh / Mỹ' },
  { id: '2', fullName: 'Leonardo DiCaprio', role: 'Diễn viên', avatarLetter: 'L', nationality: 'Mỹ' },
  { id: '3', fullName: 'Cillian Murphy', role: 'Diễn viên', avatarLetter: 'C', nationality: 'Ireland' },
  { id: '4', fullName: 'Matthew McConaughey', role: 'Diễn viên', avatarLetter: 'M', nationality: 'Mỹ' },
  { id: '5', fullName: 'Denis Villeneuve', role: 'Đạo diễn', avatarLetter: 'D', nationality: 'Canada' },
  { id: '6', fullName: 'Timothée Chalamet', role: 'Diễn viên', avatarLetter: 'T', nationality: 'Pháp / Mỹ' },
  { id: '7', fullName: 'Zendaya', role: 'Diễn viên', avatarLetter: 'Z', nationality: 'Mỹ' },
  { id: '8', fullName: 'Bong Joon-ho', role: 'Đạo diễn', avatarLetter: 'B', nationality: 'Hàn Quốc' },
];

export function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Đạo diễn' | 'Diễn viên'>('Diễn viên');
  const [nationality, setNationality] = useState('Mỹ');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingArtist) {
      setArtists((prev) =>
        prev.map((a) =>
          a.id === editingArtist.id
            ? { ...a, fullName: fullName.trim(), role, nationality, avatarLetter: fullName.trim()[0].toUpperCase() }
            : a,
        ),
      );
    } else {
      const newArtist: Artist = {
        id: Date.now().toString(),
        fullName: fullName.trim(),
        role,
        nationality,
        avatarLetter: fullName.trim()[0].toUpperCase(),
      };
      setArtists((prev) => [newArtist, ...prev]);
    }

    setModalOpen(false);
    setEditingArtist(null);
    setFullName('');
  }

  function handleOpenCreate() {
    setEditingArtist(null);
    setFullName('');
    setRole('Diễn viên');
    setNationality('Mỹ');
    setModalOpen(true);
  }

  function handleOpenEdit(artist: Artist) {
    setEditingArtist(artist);
    setFullName(artist.fullName);
    setRole(artist.role);
    setNationality(artist.nationality);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    if (window.confirm('Bạn có chắc chắn muốn xóa nghệ sĩ này?')) {
      setArtists((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
            Quản Lý Nghệ Sĩ & Diễn Viên
          </h1>
          <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
            Dữ liệu đạo diễn, biên kịch và dàn diễn viên trong các tác phẩm điện ảnh
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-brand text-white font-black text-xs sm:text-sm shadow-glow hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Thêm Nghệ Sĩ Mới
        </button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="p-5 rounded-2xl bg-surface-2 border border-white/10 hover:border-primary/40 hover:shadow-glow transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-pill bg-primary/20 border border-primary/30 text-primary font-black grid place-items-center flex-shrink-0 text-sm shadow-sm">
                {artist.avatarLetter}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-fg truncate block">
                  {artist.fullName}
                </span>
                <span className="text-xs text-fg-3">
                  {artist.role} · {artist.nationality}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleOpenEdit(artist)}
                aria-label={`Sửa nghệ sĩ ${artist.fullName}`}
                className="p-1.5 rounded-lg text-fg-3 hover:text-primary hover:bg-white/5 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(artist.id)}
                aria-label={`Xóa nghệ sĩ ${artist.fullName}`}
                className="p-1.5 rounded-lg text-fg-3 hover:text-danger hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thêm hoặc sửa nghệ sĩ"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
          />

          <div className="relative z-10 w-full max-w-md bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-display font-black text-base text-fg">
                  {editingArtist ? 'Sửa Nghệ Sĩ' : 'Thêm Nghệ Sĩ Mới'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VD: Christopher Nolan"
                  className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                  Vai Trò Chính
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Đạo diễn' | 'Diễn viên')}
                  className="w-full bg-surface-2 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-fg outline-none focus:border-primary"
                >
                  <option value="Diễn viên">Diễn viên</option>
                  <option value="Đạo diễn">Đạo diễn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-fg-3 mb-1.5 uppercase tracking-wider">
                  Quốc Tịch
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
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
                  {editingArtist ? 'Cập Nhật' : 'Tạo Nghệ Sĩ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
