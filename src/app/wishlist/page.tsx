"use client";

import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { SiteContainer } from "@/components/site-container";
import { WishlistButton } from "@/components/wishlist-button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice } from "@/lib/site-config";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  return (
    <SiteContainer className="py-10 lg:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-sm uppercase tracking-[0.3em]">My Wishlist</h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline uppercase tracking-widest"
          >
            Clear wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-600 mb-6">
            Your wishlist is empty. Tap the heart icon on products you love.
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {items.map((product) => (
            <li
              key={product.id}
              className="border border-neutral-200 flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-neutral-100">
                <Link href={`/product/${product.slug}`} className="block h-full">
                  <SiteImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </Link>
                <WishlistButton
                  product={product}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/95 hover:bg-white shadow-sm"
                  iconClassName="w-4 h-4"
                />
                {product.soldOut && (
                  <span className="absolute top-3 left-3 bg-white text-neutral-900 text-[10px] uppercase tracking-widest px-2 py-1">
                    Sold out
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <Link
                  href={`/product/${product.slug}`}
                  className="text-sm font-medium hover:underline line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-neutral-600">
                  {formatPrice(product.price)}
                </p>
                <div className="mt-4 flex-1">
                  {!product.soldOut ? (
                    <AddToCartButton product={product} compact />
                  ) : (
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      Sold out
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SiteContainer>
  );
}
