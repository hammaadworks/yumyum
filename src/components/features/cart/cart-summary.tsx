'use client';

import { Brand } from '@/lib/types';
import { useCartStore } from '@/store/use-cart.store';

interface CartSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export function CartSummary({ open, onOpenChange, brand }: CartSummaryProps) {
  const cartItems = useCartStore((state) => state.items);
  const total = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Your Order</h2>

        {cartItems.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty</p>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 space-y-2">
          {brand.whatsapp && cartItems.length > 0 && (
            <button
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg"
              onClick={() => {
                const message = encodeURIComponent(
                  `New Order:\n\n${cartItems
                    .map(
                      (item) =>
                        `${item.quantity}x ${item.name} - ₹${(item.price * item.quantity).toFixed(2)}`,
                    )
                    .join('\n')}\n\nTotal: ₹${total.toFixed(2)}`,
                );
                window.open(
                  `https://wa.me/${brand.whatsapp}?text=${message}`,
                  '_blank',
                );
              }}
            >
              Place Order on WhatsApp
            </button>
          )}
          <button
            className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
