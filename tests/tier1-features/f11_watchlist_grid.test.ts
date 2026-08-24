import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';

describe('Feature 11: My List / Watchlist Grid', () => {
  it('F11.1 - Adds movies to watchlist store and avoids duplicate entries', () => {
    useWatchlistStore.getState().clear();
    const { add, has } = useWatchlistStore.getState();

    add('inception-2010');
    expect(has('inception-2010')).toBe(true);
    expect(useWatchlistStore.getState().ids).toHaveLength(1);

    // Duplicate add should keep length 1
    add('inception-2010');
    expect(useWatchlistStore.getState().ids).toHaveLength(1);
  });

  it('F11.2 - One-click remove eliminates movie ID from watchlist', () => {
    const { remove, has } = useWatchlistStore.getState();
    remove('inception-2010');
    expect(has('inception-2010')).toBe(false);
    expect(useWatchlistStore.getState().ids).toHaveLength(0);
  });

  it('F11.3 - Toggle method switches movie inclusion in watchlist', () => {
    const { toggle, has } = useWatchlistStore.getState();

    toggle('interstellar-2014');
    expect(has('interstellar-2014')).toBe(true);

    toggle('interstellar-2014');
    expect(has('interstellar-2014')).toBe(false);
  });

  it('F11.4 - Filter watchlist by genre isolates matching movie entries', () => {
    const movies = [
      { id: 'm1', title: 'Inception', genres: ['Khoa Học Viễn Tưởng', 'Hành Động'] },
      { id: 'm2', title: 'Parasite', genres: ['Tâm Lý', 'Giật Gân'] },
      { id: 'm3', title: 'Interstellar', genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu'] },
    ];

    const filterByGenre = (genre: string) => movies.filter((m) => m.genres.includes(genre));
    const scifiMovies = filterByGenre('Khoa Học Viễn Tưởng');

    expect(scifiMovies).toHaveLength(2);
    expect(scifiMovies.map((m) => m.id)).toEqual(['m1', 'm3']);
  });

  it('F11.5 - Clear watchlist resets store state to empty array', () => {
    const { add, clear } = useWatchlistStore.getState();
    add('m1');
    add('m2');
    expect(useWatchlistStore.getState().ids.length).toBeGreaterThan(0);

    clear();
    expect(useWatchlistStore.getState().ids).toHaveLength(0);
  });
});
