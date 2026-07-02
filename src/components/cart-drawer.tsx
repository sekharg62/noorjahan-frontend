"use client";

import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { getCartLineId } from "@/lib/cart";
import { useCart } from "@/context/cart-context";
import { formatPrice, siteConfig } from "@/lib/site-config";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  if (!isOpen) return null;

  const freeShippingLeft = Math.max(
    0,
    siteConfig.shipping.freeShippingThreshold - subtotal,
  );

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-sm uppercase tracking-widest font-medium">
            Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1 hover:opacity-70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-neutral-600 mb-6">Your cart is currently empty.</p>
            <Link
              href="/"
              onClick={closeCart}
              className="bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-5 space-y-5">
              {items.map(({ product, quantity, size, sizeId }) => (
                <li
                  key={getCartLineId(product.id, sizeId)}
                  className="flex gap-4"
                >
                  <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100">
                    <SiteImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium hover:underline line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-neutral-600 mt-1">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">
                      Size: {size}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product.id, sizeId, quantity - 1)
                        }
                        className="p-1 border border-neutral-300 hover:border-neutral-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product.id, sizeId, quantity + 1)
                        }
                        className="p-1 border border-neutral-300 hover:border-neutral-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id, sizeId)}
                        className="ml-auto p-1 text-neutral-500 hover:text-neutral-900"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t p-5 space-y-4">
              {freeShippingLeft > 0 && (
                <p className="text-xs text-neutral-600 text-center">
                  Add {formatPrice(freeShippingLeft)} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-widest text-center hover:bg-neutral-800 transition-colors"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full text-center text-xs uppercase tracking-widest text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
              >
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
