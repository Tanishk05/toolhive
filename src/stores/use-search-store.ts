import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
