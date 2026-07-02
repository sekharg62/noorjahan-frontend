"use client";

import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/site-config";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { SoldOutRibbon } from "@/components/sold-out-ribbon";
import { WishlistButton } from "@/components/wishlist-button";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({
  product,
  open,
  onClose,
}: QuickViewModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 hover:opacity-70"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            <SiteImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <WishlistButton
              product={product}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 hover:bg-white shadow-sm"
              iconClassName="w-5 h-5"
            />
            {product.soldOut && <SoldOutRibbon size="md" />}
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
              {product.collectionName}
            </p>
            <h2
              id="quick-view-title"
              className="text-xl font-medium text-neutral-900"
            >
              {product.name}
            </h2>
            <p className="mt-2 text-lg">
              {formatPrice(product.price)}
              {product.compareAtPrice && (
                <span className="ml-2 text-base font-normal line-through text-neutral-400">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
              {product.totalStock > 0
                ? `${product.totalStock} in stock`
                : "Out of stock"}
            </p>
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {!product.soldOut ? (
                <AddToCartButton
                  product={product}
                  compact
                  onAdded={onClose}
                />
              ) : (
                <p className="text-sm uppercase tracking-widest text-neutral-500">
                  Sold out
                </p>
              )}
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full border border-neutral-900 text-neutral-900 py-3 text-xs uppercase tracking-widest text-center hover:bg-neutral-50 transition-colors"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
