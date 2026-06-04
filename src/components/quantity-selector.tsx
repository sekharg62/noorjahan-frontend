"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  label = "Quantity",
  compact = false,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div>
      <p
        className={`uppercase tracking-widest text-neutral-700 ${
          compact ? "text-[10px] mb-2" : "text-xs mb-3"
        }`}
      >
        {label}
      </p>
      <div
        className={`inline-flex items-center border border-neutral-300 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <button
          type="button"
          onClick={decrease}
          disabled={disabled || value <= min}
          className="p-2 sm:p-2.5 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus className={compact ? "w-3 h-3" : "w-4 h-4"} />
        </button>
        <span
          className={`min-w-[2.5rem] text-center border-x border-neutral-300 ${
            compact ? "px-2 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={increase}
          disabled={disabled || value >= max}
          className="p-2 sm:p-2.5 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className={compact ? "w-3 h-3" : "w-4 h-4"} />
        </button>
      </div>
    </div>
  );
}
