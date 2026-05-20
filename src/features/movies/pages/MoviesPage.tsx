import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MovieCard } from '../components/MovieCard';
import { GenreChip } from '../components/GenreChip';
import { GENRES, MOVIES } from '../data/movies';

type SortKey = 'rating' | 'year' | 'title';

export function MoviesPage() {
  const [genre, setGenre] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('rating');

  const list = useMemo(() => {
    const filtered = genre ? MOVIES.filter((m) => m.genres.includes(genre)) : MOVIES;
    const sorted = [...filtered];
    if (sortKey === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sortKey === 'year') sorted.sort((a, b) => b.releaseYear - a.releaseYear);
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [genre, sortKey]);

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <Navbar />
      <div className="max-w-container mx-auto px-6 lg:px-16 py-10">
        <header className="mb-8">
          <h1 className="font-display font-extrabold text-4xl text-fg">Khám Phá Phim</h1>
          <p className="text-fg-2 mt-2">Lọc theo thể loại và sắp xếp theo tiêu chí bạn yêu thích.</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-4">
          <GenreChip label="Tất Cả" active={!genre} onClick={() => setGenre(null)} />
          {GENRES.map((g) => (
            <GenreChip key={g} label={g} active={genre === g} onClick={() => setGenre(g)} />
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5 mb-6">
          <p className="text-sm text-fg-2">
            <span className="font-semibold text-fg-1">{list.length}</span> phim
            {genre ? <> · thể loại <span className="text-primary-hover">{genre}</span></> : null}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-fg-3">Sắp xếp:</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-surface-2 border border-border rounded-md h-9 px-3 text-sm text-fg-1 outline-none focus:border-primary"
            >
              <option value="rating">Điểm cao nhất</option>
              <option value="year">Mới nhất</option>
              <option value="title">Tên A–Z</option>
            </select>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 text-fg-3">Không có phim phù hợp.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {list.map((m) => (
              <MovieCard key={m.id} movie={m} size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
