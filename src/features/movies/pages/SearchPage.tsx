import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { UI } from '@/config';
import { MovieCard } from '../components/MovieCard';
import { searchMovies } from '../data/movies';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = q.trim();
      if (trimmed) setParams({ q: trimmed }, { replace: true });
      else setParams({}, { replace: true });
    }, UI.SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q, setParams]);

  const results = useMemo(() => searchMovies(q), [q]);

  return (
    <div className="max-w-container mx-auto px-6 lg:px-8 py-10">

        <h1 className="font-display font-extrabold text-4xl text-fg mb-6">Tìm Kiếm</h1>
        <div className="relative max-w-2xl mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-3" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên phim, thể loại, đạo diễn..."
            className="w-full h-12 bg-surface-2 border border-border rounded-md pl-12 pr-12 text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-fg-3"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-pill text-fg-3 hover:text-fg-1 hover:bg-white/5"
              aria-label="Xóa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {q.trim() === '' ? (
          <p className="text-fg-3">Nhập từ khóa để bắt đầu tìm kiếm.</p>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-fg-2 text-lg">Không tìm thấy phim nào cho từ khóa</p>
            <p className="text-primary-hover font-semibold mt-1">“{q}”</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-fg-2 mb-5">
              <span className="font-semibold text-fg-1">{results.length}</span> kết quả cho{' '}
              <span className="text-primary-hover">“{q}”</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
              {results.map((m) => (
                <MovieCard key={m.id} movie={m} size="sm" />
              ))}
            </div>
          </>
        )}
    </div>
  );
}
