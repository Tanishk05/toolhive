 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';

interface FavoritesState {
  favorites: string[];
  isLoaded: boolean;
  setFavorites: (favorites: string[]) => void;
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  fetchFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoaded: false,
  setFavorites: (favorites) => set({ favorites, isLoaded: true }),
  addFavorite: (slug) => set((state) => ({ favorites: [...state.favorites, slug] })),
  removeFavorite: (slug) => set((state) => ({ favorites: state.favorites.filter((f) => f !== slug) })),
  fetchFavorites: async () => {
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        set({ favorites: data.favorites.map((f: any) => f.toolSlug), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      set({ isLoaded: true });
    }
  },
}));
