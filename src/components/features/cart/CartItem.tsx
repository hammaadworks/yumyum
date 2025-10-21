import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dish } from '@/lib/types';
import { useCartStore } from '@/store/use-cart.store';
import { Trash2, Eye, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import Image from 'next/image';

interface CartItemProps {
  item: Dish & { quantity: number };
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateItemQuantity } = useCartStore();

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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-full w-16 rounded-r-none"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-square w-full">
              <Image src={item.image} alt={item.name} fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
