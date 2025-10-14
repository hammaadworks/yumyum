import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { ControlsBar } from '@/components/shared/controls-bar';

interface FilterDrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/80 backdrop-blur-sm">
        <div className="p-4" data-testid="filter-drawer-content">
            <DrawerHeader>
                <DrawerTitle>Filter & Sort</DrawerTitle>
            </DrawerHeader>
            <ControlsBar />
        </div>
      </DrawerContent>
    </Drawer>
  );
}