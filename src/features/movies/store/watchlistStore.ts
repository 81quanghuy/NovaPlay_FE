import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config';
import { userService } from '@/features/user/services/userService';

interface WatchlistState {
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  syncFromBackend: () => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const isFav = get().ids.includes(id);
        if (isFav) {
          get().remove(id);
        } else {
          get().add(id);
        }
      },
      add: (id) => {
        set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] }));
        userService.addFavorite(id).catch(() => {});
      },
      remove: (id) => {
        set((s) => ({ ids: s.ids.filter((x) => x !== id) }));
        userService.removeFavorite(id).catch(() => {});
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      syncFromBackend: async () => {
        const backendFavorites = await userService.getFavorites();
        if (backendFavorites && backendFavorites.length > 0) {
          set({ ids: backendFavorites });
        }
      },
    }),
    {
      name: STORAGE_KEYS.WATCHLIST,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
