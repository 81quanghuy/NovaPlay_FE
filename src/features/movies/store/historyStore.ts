import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchHistoryItem {
  movieId: string;
  episode?: number;
  progressPercent: number; // 0 - 100
  updatedAt: number;
}

interface HistoryState {
  history: WatchHistoryItem[];
  saveProgress: (movieId: string, episode?: number, progressPercent?: number) => void;
  removeFromHistory: (movieId: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [
        // Dữ liệu ban đầu mẫu để người dùng trải nghiệm ngay tính năng Continue Watching
        {
          movieId: 'inception',
          episode: 1,
          progressPercent: 68,
          updatedAt: Date.now() - 1000 * 60 * 30,
        },
        {
          movieId: 'squid-game',
          episode: 4,
          progressPercent: 42,
          updatedAt: Date.now() - 1000 * 60 * 120,
        },
      ],

      saveProgress: (movieId, episode = 1, progressPercent = 30) => {
        set((state) => {
          const filtered = state.history.filter((h) => h.movieId !== movieId);
          return {
            history: [
              {
                movieId,
                episode,
                progressPercent,
                updatedAt: Date.now(),
              },
              ...filtered,
            ].slice(0, 20), // Lưu tối đa 20 phim gần nhất
          };
        });
      },

      removeFromHistory: (movieId) => {
        set((state) => ({
          history: state.history.filter((h) => h.movieId !== movieId),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'novaplay:watch_history',
    },
  ),
);
