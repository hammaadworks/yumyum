import { Button } from '@/components/ui/button';
import { Dish } from '@/lib/types';
import { useCartStore } from '@/store/use-cart.store';
import { useUIStore } from '@/store/use-ui.store';
import { motion } from 'framer-motion';
import { Eye, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: Dish & { quantity: number };
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateItemQuantity } = useCartStore();
  const { openImageViewer } = useUIStore();

  return (
    <div className="relative">
      <motion.div
        drag="x"
        dragConstraints={{ left: -128, right: 0 }}
        className="bg-card p-4 rounded-lg flex items-center justify-between relative z-10"
      >
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">₹{item.price}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      <div className="absolute top-0 right-0 h-full flex items-center z-0">
        <Button
          variant="destructive"
          size="icon"
          className="h-full w-16 rounded-l-none"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-full w-16 rounded-r-none"
          onClick={() => openImageViewer(item.image)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
