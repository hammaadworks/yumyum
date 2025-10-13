import { create } from 'zustand';

export type SortOrder = 'asc' | 'desc';

interface FilterState {
  isVegOnly: boolean;
  sortOrder: SortOrder;
  searchQuery: string;
  toggleVegOnly: () => void;
  toggleSortOrder: () => void;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isVegOnly: false,
  sortOrder: 'asc',
  searchQuery: '',

  toggleVegOnly: () => set((state) => ({ isVegOnly: !state.isVegOnly })),

  toggleSortOrder: () =>
    set((state) => ({
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));