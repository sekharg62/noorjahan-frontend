"use client";

import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartOrderSuccess } from "@/components/cart-order-success";
import { SiteContainer } from "@/components/site-container";
import { getCartLineId } from "@/lib/cart";
import { useCart } from "@/context/cart-context";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { calculateShippingFee } from "@/lib/shipping";

function CartPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  if (orderId) {
    return <CartOrderSuccess orderId={orderId} />;
  }

  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const freeShippingLeft = Math.max(
    0,
    siteConfig.shipping.freeShippingThreshold - subtotal,
  );
  const shippingEstimate = calculateShippingFee(subtotal);
  const totalEstimate = subtotal + shippingEstimate;

  return (
    <SiteContainer className="max-w-3xl py-10 lg:py-16">
      <h1 className="text-center text-sm uppercase tracking-[0.3em] mb-10">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-6">Your cart is currently empty.</p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-neutral-200">
            {items.map(({ product, quantity, size }) => (
              <li
                key={getCartLineId(product.id, size)}
                className="flex gap-4 py-6"
              >
                <div className="relative w-24 h-32 shrink-0 bg-neutral-100">
                  <SiteImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-neutral-600 mt-1">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">
                    Size: {size}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(product.id, size, quantity - 1)
                      }
                      className="p-1.5 border border-neutral-300"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(product.id, size, quantity + 1)
                      }
                      className="p-1.5 border border-neutral-300"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id, size)}
                      className="ml-4 text-neutral-500 hover:text-neutral-900"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(product.price * quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-8 space-y-4">
            {freeShippingLeft > 0 && (
              <p className="text-sm text-neutral-600 text-center">
                Add {formatPrice(freeShippingLeft)} more for free shipping over{" "}
                {formatPrice(siteConfig.shipping.freeShippingThreshold)}
              </p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (est.)</span>
                <span>
                  {shippingEstimate === 0
                    ? "Free"
                    : formatPrice(shippingEstimate)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-2">
                <span>Total (est.)</span>
                <span>{formatPrice(totalEstimate)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-neutral-900 text-white py-4 text-xs uppercase tracking-widest text-center hover:bg-neutral-800 transition-colors"
            >
              Proceed to checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-sm text-neutral-500 hover:text-neutral-900 underline"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </SiteContainer>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <SiteContainer className="py-16 text-center text-sm text-neutral-500">
          Loading…
        </SiteContainer>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
