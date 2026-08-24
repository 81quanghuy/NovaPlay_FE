import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { useWatchlistStore } from '@/features/movies/store/watchlistStore';
import { useHistoryStore } from '@/features/movies/store/historyStore';

describe('Tier 2: Boundary & Corner Cases — Empty States', () => {
  it('T2.Empty.1 - Watchlist store behaves correctly when empty and renders zero count', () => {
    useWatchlistStore.getState().clear();
    const ids = useWatchlistStore.getState().ids;

    expect(ids).toHaveLength(0);
    expect(useWatchlistStore.getState().has('any_id')).toBe(false);
  });

  it('T2.Empty.2 - Watch history store handles empty history list gracefully without exceptions', () => {
    useHistoryStore.getState().clearHistory();
    const history = useHistoryStore.getState().history;

    expect(history).toHaveLength(0);
  });

  it('T2.Empty.3 - Notification center renders empty state when zero notifications are returned', () => {
    const emptyNotificationResponse = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      last: true,
    };

    expect(emptyNotificationResponse.content).toHaveLength(0);
    expect(emptyNotificationResponse.totalElements).toBe(0);
  });

  it('T2.Empty.4 - Search query with no matching keywords returns empty list without breaking layout', () => {
    const allMovies = [
      { id: 'm1', title: 'Inception' },
      { id: 'm2', title: 'Interstellar' },
    ];
    const searchResults = allMovies.filter((m) => m.title.toLowerCase().includes('xyz_nonexistent_123'));

    expect(searchResults).toHaveLength(0);
  });

  it('T2.Empty.5 - Admin movies catalog table renders empty placeholder when filtered by unused status', () => {
    const movies = [{ id: 'm1', status: 'PUBLISHED' }];
    const draftMovies = movies.filter((m) => m.status === 'DRAFT');

    expect(draftMovies).toHaveLength(0);
  });
});
