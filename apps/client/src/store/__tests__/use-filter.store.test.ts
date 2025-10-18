import { renderHook, act } from '@testing-library/react';
import { useFilterStore } from '../use-filter.store';

describe('useFilterStore', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.setState({ isVegOnly: false, sortOrder: 'asc', searchQuery: '' });
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useFilterStore());
    expect(result.current.isVegOnly).toBe(false);
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.searchQuery).toBe('');
  });

  it('toggleVegOnly flips the flag', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.toggleVegOnly());
    expect(result.current.isVegOnly).toBe(true);
    act(() => result.current.toggleVegOnly());
    expect(result.current.isVegOnly).toBe(false);
  });

  it('toggleSortOrder toggles between asc and desc', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.toggleSortOrder());
    expect(result.current.sortOrder).toBe('desc');
    act(() => result.current.toggleSortOrder());
    expect(result.current.sortOrder).toBe('asc');
  });

  it('setSearchQuery updates query', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setSearchQuery('pizza'));
    expect(result.current.searchQuery).toBe('pizza');
  });
});