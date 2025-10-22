import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Dish } from '@/lib/types';

import { Badge } from '@/components/ui/badge';

interface DescriptionDrawerProps {
  dish: Dish;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DescriptionDrawer({
  dish,
  open,
  onOpenChange,
}: DescriptionDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/80 backdrop-blur-sm">
        <div className="p-4" data-testid="description-drawer-content">
          <DrawerHeader>
            <DrawerTitle>{dish.name}</DrawerTitle>
            {dish.tag && dish.tag !== 'normal' && (
              <Badge className="mt-2">{dish.tag}</Badge>
            )}
          </DrawerHeader>
          <div className="px-4">
            <DrawerDescription>{dish.description}</DrawerDescription>
            <p className="mt-4 text-lg font-bold">₹{dish.price}</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
