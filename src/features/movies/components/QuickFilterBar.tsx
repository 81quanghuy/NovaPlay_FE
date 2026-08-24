import { ChevronDown, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { GENRES, COUNTRIES } from '../types';

interface FilterValues {
  type?: string;
  genre?: string;
  country?: string;
  sort?: string;
}

interface Props {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
  totalCount?: number;
}

const TYPES = [
  { label: 'Tất Cả Định Dạng', value: '' },
  { label: 'Phim Lẻ (Movie)', value: 'movie' },
  { label: 'Phim Bộ (Series)', value: 'series' },
] as const;

const SORTS = [
  { label: 'Điểm Đánh Giá Cao', value: 'rating' },
  { label: 'Mới Cập Nhật', value: 'year' },
  { label: 'Lượt Xem Nhiều', value: 'views' },
  { label: 'Tên Phim (A-Z)', value: 'title' },
] as const;

export function QuickFilterBar({ values, onChange, totalCount }: Props) {
  function handleSelect(key: keyof FilterValues, val: string) {
    onChange({
      ...values,
      [key]: val === '' ? undefined : val,
    });
  }

  const hasActiveFilter = Boolean(values.type || values.genre || values.country || values.sort);

  return (
    <div className="relative z-30 mb-12">
      {/* Floating Glass Island Container */}
      <div className="rounded-3xl bg-surface/90 border border-white/15 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 text-primary grid place-items-center shadow-glow">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-fg font-display tracking-tight">
                Bộ Lọc Điện Ảnh Nhanh
              </h3>
              <p className="text-xs text-fg-3">Tùy biến danh sách theo đúng sở thích của bạn</p>
            </div>
            {typeof totalCount === 'number' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-3 py-1 rounded-pill bg-primary/15 border border-primary/40 text-primary text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {totalCount} phim
              </span>
            )}
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => onChange({})}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 rounded-pill border border-primary/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Định dạng */}
          <div>
            <label htmlFor="filter-type" className="block text-xs font-bold text-fg-2 uppercase tracking-wider mb-2">
              Định dạng
            </label>
            <div className="relative">
              <select
                id="filter-type"
                value={values.type || ''}
                onChange={(e) => handleSelect('type', e.target.value)}
                className="w-full h-12 bg-surface-2 border border-white/15 rounded-xl px-4 pr-10 text-sm font-semibold text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none shadow-inner"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-surface-2 text-fg py-2">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-3" />
            </div>
          </div>

          {/* Thể loại */}
          <div>
            <label htmlFor="filter-genre" className="block text-xs font-bold text-fg-2 uppercase tracking-wider mb-2">
              Thể loại
            </label>
            <div className="relative">
              <select
                id="filter-genre"
                value={values.genre || ''}
                onChange={(e) => handleSelect('genre', e.target.value)}
                className="w-full h-12 bg-surface-2 border border-white/15 rounded-xl px-4 pr-10 text-sm font-semibold text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none shadow-inner"
              >
                <option value="" className="bg-surface-2 text-fg">Tất Cả Thể Loại</option>
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-surface-2 text-fg py-2">
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-3" />
            </div>
          </div>

          {/* Quốc gia */}
          <div>
            <label htmlFor="filter-country" className="block text-xs font-bold text-fg-2 uppercase tracking-wider mb-2">
              Quốc gia
            </label>
            <div className="relative">
              <select
                id="filter-country"
                value={values.country || ''}
                onChange={(e) => handleSelect('country', e.target.value)}
                className="w-full h-12 bg-surface-2 border border-white/15 rounded-xl px-4 pr-10 text-sm font-semibold text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none shadow-inner"
              >
                <option value="" className="bg-surface-2 text-fg">Tất Cả Quốc Gia</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-surface-2 text-fg py-2">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-3" />
            </div>
          </div>

          {/* Sắp xếp */}
          <div>
            <label htmlFor="filter-sort" className="block text-xs font-bold text-fg-2 uppercase tracking-wider mb-2">
              Sắp xếp
            </label>
            <div className="relative">
              <select
                id="filter-sort"
                value={values.sort || 'rating'}
                onChange={(e) => handleSelect('sort', e.target.value)}
                className="w-full h-12 bg-surface-2 border border-white/15 rounded-xl px-4 pr-10 text-sm font-semibold text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer appearance-none shadow-inner"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-surface-2 text-fg py-2">
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
