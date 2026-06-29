"use client";

import { useState } from "react";
import { SiteImage } from "@/components/site-image";
import { WishlistButton } from "@/components/wishlist-button";
import type { Product } from "@/types";

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const images = product.images.length > 0 ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? product.image;

  return (
    <div>
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <SiteImage
          src={activeImage}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <WishlistButton
          product={product}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 hover:bg-white shadow-sm"
          iconClassName="w-5 h-5"
        />
        {product.soldOut && (
          <span className="absolute top-4 left-4 bg-white text-neutral-900 text-xs uppercase tracking-widest px-3 py-1.5">
            Sold out
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[3/4] overflow-hidden border ${
                index === activeIndex
                  ? "border-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <SiteImage
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
