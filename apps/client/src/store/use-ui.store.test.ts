import { useUiStore } from './use-ui.store';
import { act, renderHook } from '@testing-library/react';

describe('useUiStore', () => {
  it('should start with reel view closed', () => {
    const { result } = renderHook(() => useUiStore());
    expect(result.current.isReelViewOpen).toBe(false);
    expect(result.current.initialDishId).toBeNull();
  });

  it('should open the reel view with an initial dish id', () => {
    const { result } = renderHook(() => useUiStore());

    act(() => {
      result.current.openReelView({ initialDishId: 'dish-1' });
    });

    expect(result.current.isReelViewOpen).toBe(true);
    expect(result.current.initialDishId).toBe('dish-1');
  });

  it('should close the reel view and clear the dish id', () => {
    const { result } = renderHook(() => useUiStore());

    act(() => {
      result.current.openReelView({ initialDishId: 'dish-1' });
    });

    act(() => {
      result.current.closeReelView();
    });

    expect(result.current.isReelViewOpen).toBe(false);
    expect(result.current.initialDishId).toBeNull();
  });
});
