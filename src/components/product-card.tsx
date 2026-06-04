"use client";

import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { useState } from "react";
import { Eye } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/site-config";
import { QuickViewModal } from "@/components/quick-view-modal";
import { WishlistButton } from "@/components/wishlist-button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <article className="group relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Link href={`/product/${product.slug}`} className="block h-full">
            <SiteImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          </Link>

          <WishlistButton
            product={product}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 hover:bg-white shadow-sm"
            iconClassName="w-4 h-4"
          />

          {product.soldOut && (
            <span className="absolute top-3 left-3 bg-white text-neutral-900 text-[10px] uppercase tracking-widest px-2 py-1">
              Sold out
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 text-neutral-900 text-[10px] uppercase tracking-widest py-2.5 hover:bg-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick view
            </button>
            {!product.soldOut && (
              <button
                type="button"
                onClick={() => setQuickViewOpen(true)}
                className="flex-1 bg-neutral-900 text-white text-[10px] uppercase tracking-widest py-2.5 hover:bg-neutral-800 transition-colors"
              >
                Select size
              </button>
            )}
          </div>
        </div>

        <div className="mt-3.5 px-0.5 text-center">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-neutral-900 leading-snug hover:opacity-80 transition-opacity">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1.5 text-sm font-semibold text-neutral-900 tracking-wide">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="ml-2 font-normal line-through text-neutral-400">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
        </div>
      </article>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
