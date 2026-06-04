"use client";

import type { Product } from "@/types";
import { WishlistButton } from "@/components/wishlist-button";

export function ProductWishlistRow({ product }: { product: Product }) {
  return (
    <div className="mt-4 flex items-center">
      <WishlistButton product={product} showLabel iconClassName="w-5 h-5" />
    </div>
  );
}
