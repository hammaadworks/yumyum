import { useUIStore } from './use-ui.store';
import { act, renderHook } from '@testing-library/react';

describe('useUIStore', () => {
  it('should start with all views closed', () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.isReelViewOpen).toBe(false);
    expect(result.current.isCartSummaryOpen).toBe(false);
    expect(result.current.isFeedbackViewOpen).toBe(false);
    expect(result.current.isStatusViewerOpen).toBe(false);
    expect(result.current.isQRCodeModalOpen).toBe(false);
  });

  it('should open and close the reel view', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.openReelView();
    });
    expect(result.current.isReelViewOpen).toBe(true);
    act(() => {
      result.current.closeReelView();
    });
    expect(result.current.isReelViewOpen).toBe(false);
  });

  it('should open and close the cart summary', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.openCartSummary();
    });
    expect(result.current.isCartSummaryOpen).toBe(true);
    act(() => {
      result.current.closeCartSummary();
    });
    expect(result.current.isCartSummaryOpen).toBe(false);
  });

  it('should open and close the feedback view', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.openFeedbackView();
    });
    expect(result.current.isFeedbackViewOpen).toBe(true);
    act(() => {
      result.current.closeFeedbackView();
    });
    expect(result.current.isFeedbackViewOpen).toBe(false);
  });

  it('should open and close the status viewer', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.openStatusViewer();
    });
    expect(result.current.isStatusViewerOpen).toBe(true);
    act(() => {
      result.current.closeStatusViewer();
    });
    expect(result.current.isStatusViewerOpen).toBe(false);
  });

  it('should open and close the QR code modal', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.openQRCodeModal();
    });
    expect(result.current.isQRCodeModalOpen).toBe(true);
    act(() => {
      result.current.closeQRCodeModal();
    });
    expect(result.current.isQRCodeModalOpen).toBe(false);
  });
});
