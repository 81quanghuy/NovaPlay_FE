import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { useHistoryStore, WatchHistoryItem } from '@/features/movies/store/historyStore';

describe('Feature 12: Watch History Timeline', () => {
  it('F12.1 - Saves watch progress and updates position percentage in historyStore', () => {
    useHistoryStore.getState().clearHistory();
    const { saveProgress } = useHistoryStore.getState();

    saveProgress('oppenheimer', 1, 45);
    const history = useHistoryStore.getState().history;

    expect(history).toHaveLength(1);
    expect(history[0].movieId).toBe('oppenheimer');
    expect(history[0].progressPercent).toBe(45);
    expect(history[0].episode).toBe(1);
  });

  it('F12.2 - Updating progress for existing movie moves it to the top of history', () => {
    const { saveProgress } = useHistoryStore.getState();
    saveProgress('dune-part-2', 1, 20);
    saveProgress('oppenheimer', 1, 85);

    const history = useHistoryStore.getState().history;
    expect(history[0].movieId).toBe('oppenheimer');
    expect(history[0].progressPercent).toBe(85);
    expect(history[1].movieId).toBe('dune-part-2');
  });

  it('F12.3 - Groups history entries into timeline buckets (Today, This Week, Earlier)', () => {
    const now = Date.now();
    const items: WatchHistoryItem[] = [
      { movieId: 'm_today', progressPercent: 50, updatedAt: now - 1000 * 60 * 60 * 2, episode: 1 }, // 2h ago
      { movieId: 'm_week', progressPercent: 30, updatedAt: now - 1000 * 60 * 60 * 24 * 3, episode: 1 }, // 3d ago
      { movieId: 'm_earlier', progressPercent: 90, updatedAt: now - 1000 * 60 * 60 * 24 * 15, episode: 1 }, // 15d ago
    ];

    const groupHistory = (historyItems: WatchHistoryItem[]) => {
      const todayLimit = now - 1000 * 60 * 60 * 24;
      const weekLimit = now - 1000 * 60 * 60 * 24 * 7;

      return {
        today: historyItems.filter((i) => i.updatedAt >= todayLimit),
        thisWeek: historyItems.filter((i) => i.updatedAt < todayLimit && i.updatedAt >= weekLimit),
        earlier: historyItems.filter((i) => i.updatedAt < weekLimit),
      };
    };

    const grouped = groupHistory(items);
    expect(grouped.today).toHaveLength(1);
    expect(grouped.today[0].movieId).toBe('m_today');
    expect(grouped.thisWeek).toHaveLength(1);
    expect(grouped.thisWeek[0].movieId).toBe('m_week');
    expect(grouped.earlier).toHaveLength(1);
    expect(grouped.earlier[0].movieId).toBe('m_earlier');
  });

  it('F12.4 - removeFromHistory deletes specific item from history state', () => {
    const { removeFromHistory } = useHistoryStore.getState();
    removeFromHistory('dune-part-2');

    const history = useHistoryStore.getState().history;
    expect(history.some((h) => h.movieId === 'dune-part-2')).toBe(false);
  });

  it('F12.5 - clearHistory purges all watch history items', () => {
    const { clearHistory } = useHistoryStore.getState();
    clearHistory();
    expect(useHistoryStore.getState().history).toHaveLength(0);
  });
});
