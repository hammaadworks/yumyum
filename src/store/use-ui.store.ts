import { create } from 'zustand';

interface UIState {
  isReelViewOpen: boolean;
  openReelView: () => void;
  closeReelView: () => void;
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
  openReelView: () => set({ isReelViewOpen: true }),
  closeReelView: () => set({ isReelViewOpen: false }),
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