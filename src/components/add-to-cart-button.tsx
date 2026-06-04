"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { QuantitySelector } from "@/components/quantity-selector";
import { SizeSelector } from "@/components/size-selector";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  compact?: boolean;
  onAdded?: () => void;
}

export function AddToCartButton({
  product,
  className,
  compact = false,
  onAdded,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "M");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  if (product.soldOut) {
    return (
      <button
        type="button"
        disabled
        className={
          className ??
          "w-full bg-neutral-200 text-neutral-500 py-4 text-xs uppercase tracking-widest cursor-not-allowed"
        }
      >
        Sold out
      </button>
    );
  }

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, selectedSize, quantity);
    onAdded?.();
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <SizeSelector
        sizes={product.sizes}
        selected={selectedSize}
        onChange={setSelectedSize}
        compact={compact}
      />

      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        compact={compact}
      />

      {sizeError && (
        <p className="text-xs text-red-600">Please select a size</p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className={
          className ??
          "w-full bg-neutral-900 text-white py-4 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        }
      >
        Add to cart
        {quantity > 1 ? ` (${quantity})` : ""}
      </button>
    </div>
  );
}
