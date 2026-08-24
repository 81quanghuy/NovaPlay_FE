import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { QuickFilterBar } from '../components/QuickFilterBar';
import { MOVIES } from '../data/movies';

export function MoviesPage() {
  const [params, setParams] = useSearchParams();

  const type = params.get('type') || undefined;
  const genre = params.get('genre') || undefined;
  const country = params.get('country') || undefined;
  const sort = params.get('sort') || 'rating';

  const filterValues = useMemo(
    () => ({
      type,
      genre,
      country,
      sort,
    }),
    [type, genre, country, sort],
  );

  const handleFilterChange = (next: {
    type?: string;
    genre?: string;
    country?: string;
    sort?: string;
  }) => {
    const newParams = new URLSearchParams();
    if (next.type) newParams.set('type', next.type);
    if (next.genre) newParams.set('genre', next.genre);
    if (next.country) newParams.set('country', next.country);
    if (next.sort && next.sort !== 'rating') newParams.set('sort', next.sort);
    setParams(newParams, { replace: true });
  };

  const list = useMemo(() => {
    let filtered = [...MOVIES];
    if (type) filtered = filtered.filter((m) => m.type === type);
    if (genre) filtered = filtered.filter((m) => m.genres.includes(genre));
    if (country) filtered = filtered.filter((m) => m.country === country);

    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'year') filtered.sort((a, b) => b.releaseYear - a.releaseYear);
    else if (sort === 'views') filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    else filtered.sort((a, b) => a.title.localeCompare(b.title));

    return filtered;
  }, [type, genre, country, sort]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-fg">
          Khám Phá Phim
        </h1>
        <p className="text-fg-2 text-sm sm:text-base mt-2">
          Lọc và tìm kiếm trong kho phim chất lượng cao với phụ đề Vietsub và Thuyết minh.
        </p>
      </header>

      {/* Quick Filter Component */}
      <QuickFilterBar
        values={filterValues}
        onChange={handleFilterChange}
        totalCount={list.length}
      />

      {/* Movie Grid */}
      {list.length === 0 ? (
        <div className="text-center py-20 text-fg-3 bg-surface-2/40 rounded-2xl border border-white/5">
          Không có phim nào phù hợp với bộ lọc đã chọn.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {list.map((m) => (
            <MovieCard key={m.id} movie={m} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
