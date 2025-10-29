import { renderHook, act } from '@testing-library/react';
import { useFilterStore } from '@/store/use-filter.store';

describe('useFilterStore', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.setState({
        vegOnly: false,
        sortBy: 'asc',
        searchQuery: '',
      });
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useFilterStore());
    expect(result.current.vegOnly).toBe(false);
    expect(result.current.sortBy).toBe('asc');
    expect(result.current.searchQuery).toBe('');
  });

  it('toggleVegOnly flips the flag', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.toggleVegOnly());
    expect(result.current.vegOnly).toBe(true);
    act(() => result.current.toggleVegOnly());
    expect(result.current.vegOnly).toBe(false);
  });

  it('toggleSortBy toggles between asc and desc', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.toggleSortBy());
    expect(result.current.sortBy).toBe('desc');
    act(() => result.current.toggleSortBy());
    expect(result.current.sortBy).toBe('asc');
  });

  it('setSearchQuery updates query', () => {
    const { result } = renderHook(() => useFilterStore());
    act(() => result.current.setSearchQuery('pizza'));
    expect(result.current.searchQuery).toBe('pizza');
  });
});
