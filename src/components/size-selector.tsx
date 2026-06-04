"use client";

interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onChange: (size: string) => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

export function SizeSelector({
  sizes,
  selected,
  onChange,
  disabled = false,
  label = "Size",
  compact = false,
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
          const isSelected = size === selected;
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
              onClick={() => onChange(size)}
              aria-pressed={isSelected}
              className={[
                "min-w-[2.5rem] border text-center uppercase tracking-wider transition-colors",
                compact ? "px-2 py-1.5 text-[10px]" : "px-3 py-2 text-xs",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-900",
                disabled ? "opacity-50 cursor-not-allowed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
