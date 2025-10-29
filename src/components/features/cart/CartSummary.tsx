import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Brand } from '@/lib/types';
import { generateWhatsAppLink } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart.store';
import { useUIStore } from '@/store/use-ui.store';
import { X } from 'lucide-react';
import { FeedbackView } from '@/components/features/feedback/FeedbackView';
import { CartItem } from '@/components/features/cart/CartItem';

interface CartSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export function CartSummary({ open, onOpenChange, brand }: CartSummaryProps) {
  const { items } = useCartStore();
  const { openFeedbackView, isFeedbackViewOpen } = useUIStore();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const formatWhatsAppMessage = () => {
    let message = `Order from ${brand.name}:\n\n`;
    items.forEach((item) => {
      message += `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nTotal: ₹${total.toFixed(2)}`;
    return message;
  };

  const handleWhatsAppOrder = () => {
    const message = formatWhatsAppMessage();
    window.open(generateWhatsAppLink(brand.whatsapp, message), '_blank');
  };

  const handleUpiPay = () => {
    if (brand.payment_link) {
      window.open(brand.payment_link, '_blank');
    } else {
      console.warn('UPI payment is not available for this brand.');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background/80 backdrop-blur-sm">
        <div className="p-4" data-testid="cart-summary-content">
          <DrawerHeader>
            <DrawerTitle>Your Order</DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <DrawerDescription>Your cart is empty.</DrawerDescription>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <DrawerFooter>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">₹{total.toFixed(2)}</p>
              </div>
              <Button onClick={handleWhatsAppOrder}>
                Place Order on WhatsApp
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUpiPay}
                  disabled={!brand.payment_link}
                >
                  UPI Pay
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openFeedbackView}
                >
                  Leave a rating
                </Button>
              </div>
            </DrawerFooter>
          )}
        </div>
        {isFeedbackViewOpen && <FeedbackView brand={brand} />}
      </DrawerContent>
    </Drawer>
  );
}
