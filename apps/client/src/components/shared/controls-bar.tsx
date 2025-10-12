'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown } from 'lucide-react';
import { useFilterStore } from '@/store/use-filter.store';

export function ControlsBar() {
  const {
    isVegOnly,
    sortOrder,
    searchQuery,
    toggleVegOnly,
    toggleSortOrder,
    setSearchQuery,
  } = useFilterStore();

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 my-4 bg-card rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="relative flex-grow min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Veg Only Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="veg-only"
            checked={isVegOnly}
            onCheckedChange={toggleVegOnly}
          />
          <Label htmlFor="veg-only">Veg Only</Label>
        </div>

        {/* Sort Button */}
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={toggleSortOrder}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
        </Button>
      </div>
    </div>
  );
}