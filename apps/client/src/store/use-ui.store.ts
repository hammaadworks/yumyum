import { create } from 'zustand';

interface UiState {
  isReelViewOpen: boolean;
  initialDishId: string | null;
  openReelView: (payload: { initialDishId: string }) => void;
  closeReelView: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isReelViewOpen: false,
  initialDishId: null,
  openReelView: (payload) =>
    set({
      isReelViewOpen: true,
      initialDishId: payload.initialDishId,
    }),
  closeReelView: () =>
    set({
      isReelViewOpen: false,
      initialDishId: null,
    }),
}));
