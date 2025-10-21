import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { useFilterStore } from '@/store/use-filter.store';
import { useDebounce } from '@/hooks/use-debounce';

export function ControlsBar() {
  const { vegOnly, sortBy, searchQuery, toggleVegOnly, toggleSortBy, setSearchQuery } = useFilterStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const sortLabel = sortBy === 'asc' ? 'Low to High' : 'High to Low';

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 my-4 bg-card rounded-lg shadow-sm">
      <div className="relative flex-grow min-w-[200px]">
        <Label htmlFor="search-menu" className="sr-only">Search menu</Label>
        <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-menu"
          placeholder="Search dishes..."
          className="pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => setLocalSearch('')}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="veg-only"
            checked={vegOnly}
            onCheckedChange={toggleVegOnly}
            aria-label="Toggle vegetable only filter"
          />
          <Label htmlFor="veg-only">Veg Only</Label>
        </div>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={toggleSortBy}
          aria-label={`Sort by price, currently ${sortLabel}`}
        >
          <ArrowUpDown aria-hidden="true" className="h-4 w-4" />
          <span>Price: {sortLabel}</span>
        </Button>
      </div>
    </div>
  );
}