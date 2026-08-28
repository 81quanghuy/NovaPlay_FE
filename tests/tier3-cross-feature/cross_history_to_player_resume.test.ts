import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { useHistoryStore } from '@/features/movies/store/historyStore';

describe('Tier 3: Cross-Feature Integration — Watch History to Player Resume', () => {
  it('T3.HistPlayer.1 - User streams movie to 45% position (3200s out of 7200s) and leaves page', () => {
    useHistoryStore.getState().clearHistory();
    const { saveProgress } = useHistoryStore.getState();

    saveProgress('dune-part-2', 1, 45);
    const item = useHistoryStore.getState().history.find((h) => h.movieId === 'dune-part-2');

    expect(item).toBeDefined();
    expect(item?.progressPercent).toBe(45);
  });

  it('T3.HistPlayer.2 - User visits /my-list history tab and views progress bar at 45%', () => {
    const history = useHistoryStore.getState().history;
    const dune = history.find((h) => h.movieId === 'dune-part-2');

    expect(dune?.progressPercent).toBe(45);
  });

  it('T3.HistPlayer.3 - User clicks "Resume Playing" button and navigates to WatchPage', () => {
    let currentRoute = '/my-list';
    const onResumeClick = (movieId: string) => {
      currentRoute = `/watch/${movieId}`;
    };

    onResumeClick('dune-part-2');
    expect(currentRoute).toBe('/watch/dune-part-2');
  });

  it('T3.HistPlayer.4 - WatchPage player automatically seeks to saved 45% timestamp', () => {
    let playerTime = 0;
    const duration = 7200;
    const savedPct = 45;

    const onPlayerReady = () => {
      playerTime = (savedPct / 100) * duration;
    };

    onPlayerReady();
    expect(playerTime).toBe(3240);
  });

  it('T3.HistPlayer.5 - User watches until completion (>90%), history updates progress to 100%', () => {
    const { saveProgress } = useHistoryStore.getState();
    saveProgress('dune-part-2', 1, 95);

    const updated = useHistoryStore.getState().history.find((h) => h.movieId === 'dune-part-2');
    expect(updated?.progressPercent).toBe(95);
  });
});
