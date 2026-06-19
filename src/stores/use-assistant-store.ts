import { create } from "zustand";

interface AssistantState {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: (open: boolean) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
