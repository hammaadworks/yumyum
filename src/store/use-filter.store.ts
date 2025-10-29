import { create } from 'zustand';

type SortBy = 'asc' | 'desc';

export interface FilterState {
  vegOnly: boolean;
  sortBy: SortBy;
  searchQuery: string;
  toggleVegOnly: () => void;
  toggleSortBy: () => void;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  vegOnly: false,
  sortBy: 'asc',
  searchQuery: '',
  toggleVegOnly: () => set((state) => ({ vegOnly: !state.vegOnly })),
  toggleSortBy: () =>
    set((state) => ({ sortBy: state.sortBy === 'asc' ? 'desc' : 'asc' })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
