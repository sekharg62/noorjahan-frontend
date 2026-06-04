"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { useWishlist } from "@/context/wishlist-context";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
}

export function WishlistButton({
  product,
  className = "",
  iconClassName = "w-5 h-5",
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={[
        "inline-flex items-center justify-center gap-1.5 transition-colors",
        active ? "text-red-500 hover:text-red-600" : "text-neutral-700 hover:text-red-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      aria-pressed={active}
    >
      <Heart
        className={[iconClassName, active ? "fill-current" : "fill-none"].join(" ")}
        strokeWidth={1.5}
      />
      {showLabel && (
        <span className="text-xs uppercase tracking-widest">
          {active ? "Saved" : "Wishlist"}
        </span>
      )}
    </button>
  );
}
