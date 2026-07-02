"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import {
  findProductSize,
  getDefaultSelectedSize,
} from "@/lib/product-sizes";
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
  const [selectedSize, setSelectedSize] = useState(() =>
    getDefaultSelectedSize(product),
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const selectedSizeOption = findProductSize(product, selectedSize);
  const maxQuantity = Math.max(selectedSizeOption?.stock ?? 0, 0);

  useEffect(() => {
    const nextSize = getDefaultSelectedSize(product);
    setSelectedSize(nextSize);
    setQuantity(1);
    setSizeError(false);
  }, [product.id, product.sizes, product.totalStock]);

  useEffect(() => {
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  if (product.soldOut || product.sizes.length === 0) {
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
    if (!selectedSize || !selectedSizeOption || selectedSizeOption.stock <= 0) {
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
        showStock={false}
      />

      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        compact={compact}
        max={Math.max(maxQuantity, 1)}
        disabled={maxQuantity <= 0}
      />

      {sizeError && (
        <p className="text-xs text-red-600">Please select an available size</p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={maxQuantity <= 0}
        className={
          className ??
          "w-full bg-neutral-900 text-white py-4 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        Add to cart
        {quantity > 1 ? ` (${quantity})` : ""}
      </button>
    </div>
  );
}
