"use client";

import { useEffect, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import type { Product } from "@/types";
import {
  COLLECTION_SORT_OPTIONS,
  countProductsWithSize,
  getCollectionSizeOptions,
  getPriceBounds,
  type CollectionFilterState,
} from "@/lib/collection-filters";
import { PriceRangeSlider } from "@/components/price-range-slider";
import { formatPrice, siteConfig } from "@/lib/site-config";

interface CollectionFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  draft: CollectionFilterState;
  onDraftChange: (next: CollectionFilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-900">
      <span className="text-neutral-400" aria-hidden>
        —
      </span>
      {children}
    </h3>
  );
}

export function CollectionFilterDrawer({
  open,
  onClose,
  products,
  draft,
  onDraftChange,
  onApply,
  onClear,
}: CollectionFilterDrawerProps) {
  const bounds = getPriceBounds(products);
  const sizeOptions = getCollectionSizeOptions(products);
  const currencySymbol = siteConfig.shipping.currencySymbol;

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updatePrice = (key: "priceMin" | "priceMax", raw: string) => {
    const parsed = parseFloat(raw);
    const value = Number.isFinite(parsed) ? parsed : bounds.min;
    const clamped = Math.min(Math.max(value, bounds.min), bounds.max);
    if (key === "priceMin") {
      onDraftChange({
        ...draft,
        priceMin: Math.min(clamped, draft.priceMax),
      });
    } else {
      onDraftChange({
        ...draft,
        priceMax: Math.max(clamped, draft.priceMin),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filter and sort products"
        className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
      >
        <header className="shrink-0 px-5 pt-5 pb-4 border-b border-neutral-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                Filter and sort
              </h2>
              <p className="mt-1 text-xs text-neutral-500 uppercase tracking-wide">
                {products.length} products
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-900 hover:opacity-70 transition-opacity"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
          <section>
            <SectionTitle>Availability</SectionTitle>
            <label className="mt-4 flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm text-neutral-800">In stock only</span>
              <input
                type="checkbox"
                role="switch"
                checked={draft.inStockOnly}
                onChange={(e) =>
                  onDraftChange({ ...draft, inStockOnly: e.target.checked })
                }
                className="h-5 w-9 shrink-0 appearance-none rounded-full bg-neutral-200 checked:bg-neutral-900 transition-colors relative cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
              />
            </label>
          </section>

          <section className="overflow-visible">
            <SectionTitle>Price</SectionTitle>
            <p className="mt-3 text-sm text-neutral-600">
              The highest price is {formatPrice(bounds.max)}
            </p>
            <PriceRangeSlider
              min={bounds.min}
              max={bounds.max}
              step={1}
              valueMin={draft.priceMin}
              valueMax={draft.priceMax}
              onChange={(priceMin, priceMax) =>
                onDraftChange({ ...draft, priceMin, priceMax })
              }
            />
            <div className="mt-4 flex items-stretch gap-0">
              <label className="flex-1 flex items-center border border-neutral-300 min-h-[2.75rem]">
                <span className="pl-3 text-sm text-neutral-500 shrink-0">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min={bounds.min}
                  max={bounds.max}
                  step="0.01"
                  value={draft.priceMin.toFixed(2)}
                  onChange={(e) => updatePrice("priceMin", e.target.value)}
                  className="w-full py-2.5 pr-3 pl-1.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  aria-label="Minimum price"
                />
              </label>
              <label className="flex-1 flex items-center border border-neutral-300 border-l-0 min-h-[2.75rem]">
                <span className="pl-3 text-sm text-neutral-500 shrink-0">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min={bounds.min}
                  max={bounds.max}
                  step="0.01"
                  value={draft.priceMax.toFixed(2)}
                  onChange={(e) => updatePrice("priceMax", e.target.value)}
                  className="w-full py-2.5 pr-3 pl-1.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                  aria-label="Maximum price"
                />
              </label>
            </div>
          </section>

          {sizeOptions.length > 0 && (
            <section>
              <SectionTitle>Size</SectionTitle>
              <ul className="mt-4 space-y-3">
                {sizeOptions.map((size) => {
                  const checked = draft.sizes.includes(size);
                  const count = countProductsWithSize(products, size);
                  return (
                    <li key={size}>
                      <label className="flex items-center gap-3 cursor-pointer text-sm text-neutral-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const sizes = checked
                              ? draft.sizes.filter((s) => s !== size)
                              : [...draft.sizes, size];
                            onDraftChange({ ...draft, sizes });
                          }}
                          className="h-4 w-4 border-neutral-300 accent-neutral-900"
                        />
                        <span className="uppercase tracking-wide">
                          {size}
                        </span>
                        <span className="text-neutral-400">({count})</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <SectionTitle>Sort by</SectionTitle>
            <div className="relative mt-4">
              <select
                value={draft.sort}
                onChange={(e) =>
                  onDraftChange({
                    ...draft,
                    sort: e.target.value as CollectionFilterState["sort"],
                  })
                }
                className="w-full appearance-none border border-neutral-300 bg-white py-3 pl-4 pr-10 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                aria-label="Sort products"
              >
                {COLLECTION_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                strokeWidth={1.5}
              />
            </div>
          </section>
        </div>

        <footer className="shrink-0 flex items-center justify-between gap-4 px-5 py-4 border-t border-neutral-200 bg-white">
          <button
            type="button"
            onClick={onClear}
            className="text-xs uppercase tracking-widest underline underline-offset-4 text-neutral-900 hover:opacity-70"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 max-w-[200px] bg-neutral-900 text-white text-xs uppercase tracking-widest py-3.5 hover:bg-neutral-800 transition-colors"
          >
            Apply
          </button>
        </footer>
      </aside>
    </div>
  );
}
