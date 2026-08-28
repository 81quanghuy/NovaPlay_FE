import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Dices,
  Flame,
  Heart,
  Laugh,
  Play,
  Skull,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { MOVIES } from '../data/movies';
import { PATHS } from '@/routes/paths';


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS = [
  {
    id: 'chill',
    label: 'Xả Stress & Cười Vui',
    icon: Laugh,
    desc: 'Phim hài hước, hoạt hình tươi sáng',
    genres: ['Hài', 'Hoạt Hình'],
  },
  {
    id: 'action',
    label: 'Kịch Tính & Adrenaline',
    icon: Zap,
    desc: 'Hành động mãn nhãn, giật gân cuốn hút',
    genres: ['Hành Động', 'Giật Gân'],
  },
  {
    id: 'mind',
    label: 'Khám Phá & Trí Tuệ',
    icon: Compass,
    desc: 'Khoa học viễn tưởng, phiêu lưu kỳ bí',
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu'],
  },
  {
    id: 'horror',
    label: 'Cảm Giác Mạnh & Rùng Rợn',
    icon: Skull,
    desc: 'Kinh dị, giật gân nghẹt thở',
    genres: ['Kinh Dị', 'Tội Phạm'],
  },
  {
    id: 'love',
    label: 'Hẹn Hò & Cảm Xúc',
    icon: Heart,
    desc: 'Lãng mạn ngọt ngào, tâm lý sâu lắng',
    genres: ['Lãng Mạn', 'Tâm Lý'],
  },
];

export function CinemaMoodMatcher({ isOpen, onClose }: Props) {
  const [selectedMood, setSelectedMood] = useState<string>('chill');
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const currentMoodObj = MOODS.find((m) => m.id === selectedMood) || MOODS[0];
  const suggestedMovies = MOVIES.filter((m) =>
    m.genres.some((g) => currentMoodObj.genres.includes(g)),
  ).slice(0, 3);

  function handleLuckyRoll() {
    setIsSpinning(true);
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    setTimeout(() => {
      setSelectedMood(randomMood.id);
      setIsSpinning(false);
    }, 400);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hôm Nay Xem Gì?"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Đóng bảng gợi ý"
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
      />

      <div className="relative z-10 w-full max-w-3xl bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 text-primary grid place-items-center shadow-glow">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-black text-lg sm:text-2xl text-fg tracking-tight">
                🎲 Hôm Nay Bạn Muốn Xem Gì?
              </h2>
              <p className="text-xs sm:text-sm text-fg-3">
                Chọn tâm trạng hiện tại để NovaPlay gợi ý bộ phim chuẩn gu nhất
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-9 h-9 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mood Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all duration-fast ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-glow ring-1 ring-primary'
                    : 'bg-surface-2 border-white/10 text-fg-2 hover:bg-white/10 hover:border-primary/40 hover:text-fg'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                <span className="text-xs font-black leading-snug">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lucky Spin Button */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-surface-2 border border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-gold" />
            <span className="text-xs sm:text-sm text-fg font-semibold">
              Đang chọn: <strong className="text-primary font-black">{currentMoodObj.label}</strong> ({currentMoodObj.desc})
            </span>
          </div>

          <button
            type="button"
            onClick={handleLuckyRoll}
            disabled={isSpinning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-grad-brand text-white text-xs font-black shadow-glow hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            Quay Ngẫu Nhiên
          </button>
        </div>

        {/* Suggested Movies Grid */}
        <div>
          <h3 className="text-xs font-extrabold text-fg-3 uppercase tracking-wider mb-3">
            Gợi Ý Xuất Sắc Cho Bạn
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {suggestedMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative rounded-2xl overflow-hidden bg-surface-2 border border-white/10 hover:border-primary/60 hover:shadow-glow transition-all duration-base p-3 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-surface">
                  <img
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/10 text-gold text-[11px] font-black inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-gold" />
                    {movie.rating.toFixed(1)}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-fg truncate group-hover:text-primary transition-colors">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-fg-3 truncate mt-0.5">
                    {movie.releaseYear} · {movie.genres.slice(0, 2).join(', ')}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <Link
                    to={PATHS.MOVIE_DETAIL(movie.id)}
                    onClick={onClose}
                    className="text-xs font-bold text-fg-2 hover:text-fg transition-colors"
                  >
                    Chi tiết
                  </Link>

                  <Link
                    to={PATHS.WATCH(movie.id)}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-white text-xs font-black shadow-glow hover:bg-primary-hover transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" /> Xem ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
