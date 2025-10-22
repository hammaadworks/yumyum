import { create } from 'zustand';

export interface UIState {
  isReelViewOpen: boolean;
  // optional id of the dish to open inside the reel view
  currentReelDishId?: string | null;
  // Index of the active dish in the reel view
  activeIndex: number;
  openReelView: (dishId?: string | null) => void;
  closeReelView: () => void;
  setActiveIndex: (index: number) => void;
  isCartSummaryOpen: boolean;
  openCartSummary: () => void;
  closeCartSummary: () => void;
  isFeedbackViewOpen: boolean;
  openFeedbackView: () => void;
  closeFeedbackView: () => void;
  isStatusViewerOpen: boolean;
  openStatusViewer: () => void;
  closeStatusViewer: () => void;
  isQRCodeModalOpen: boolean;
  openQRCodeModal: () => void;
  closeQRCodeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isReelViewOpen: false,
  currentReelDishId: null,
  activeIndex: 0,
  openReelView: (dishId?: string | null) =>
    set({ isReelViewOpen: true, currentReelDishId: dishId || null }),
  closeReelView: () => set({ isReelViewOpen: false, currentReelDishId: null }),
  setActiveIndex: (index: number) => set({ activeIndex: index }),
  isCartSummaryOpen: false,
  openCartSummary: () => set({ isCartSummaryOpen: true }),
  closeCartSummary: () => set({ isCartSummaryOpen: false }),
  isFeedbackViewOpen: false,
  openFeedbackView: () => set({ isFeedbackViewOpen: true }),
  closeFeedbackView: () => set({ isFeedbackViewOpen: false }),
  isStatusViewerOpen: false,
  openStatusViewer: () => set({ isStatusViewerOpen: true }),
  closeStatusViewer: () => set({ isStatusViewerOpen: false }),
  isQRCodeModalOpen: false,
  openQRCodeModal: () => set({ isQRCodeModalOpen: true }),
  closeQRCodeModal: () => set({ isQRCodeModalOpen: false }),
}));
