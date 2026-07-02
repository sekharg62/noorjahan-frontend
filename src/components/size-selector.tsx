"use client";

import type { ProductSize } from "@/types";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
  showStock?: boolean;
}

export function SizeSelector({
  sizes,
  selected,
  onChange,
  disabled = false,
  label = "Size",
  compact = false,
  showStock = true,
}: SizeSelectorProps) {
  return (
    <div>
      <p
        className={`uppercase tracking-widest text-neutral-700 ${
          compact ? "text-[10px] mb-2" : "text-xs mb-3"
        }`}
      >
        {label}: <span className="text-neutral-900 font-medium">{selected}</span>
      </p>
      <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
        {sizes.map((size) => {
          const isSelected = size.label === selected;
          const isOutOfStock = size.stock <= 0;

          return (
            <button
              key={size.id}
              type="button"
              disabled={disabled || isOutOfStock}
              onClick={() => onChange(size.label)}
              aria-pressed={isSelected}
              className={[
                "min-w-[2.75rem] border text-center uppercase tracking-wider transition-colors",
                compact ? "px-2 py-1.5 text-[10px]" : "px-3 py-2 text-xs",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-900",
                isOutOfStock
                  ? "opacity-40 cursor-not-allowed line-through"
                  : "",
                disabled ? "opacity-50 cursor-not-allowed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="block">{size.label}</span>
              {showStock && (
                <span
                  className={`block text-[9px] normal-case tracking-normal mt-0.5 ${
                    isSelected
                      ? "text-white/80"
                      : isOutOfStock
                        ? "text-neutral-400"
                        : "text-neutral-500"
                  }`}
                >
                  {isOutOfStock ? "Sold out" : `${size.stock} left`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
