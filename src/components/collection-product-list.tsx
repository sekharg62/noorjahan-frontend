"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { CollectionFilterDrawer } from "@/components/collection-filter-drawer";
import {
  createDefaultFilters,
  filterAndSortProducts,
  sortOptionFromQuery,
  sortOptionToQuery,
  type CollectionFilterState,
} from "@/lib/collection-filters";

interface CollectionProductListProps {
  products: Product[];
}

export function CollectionProductList({ products }: CollectionProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultFilters = useMemo(() => createDefaultFilters(products), [products]);

  const initialFilters = useMemo(() => {
    const sortFromUrl = sortOptionFromQuery(searchParams.get("sort_by"));
    return {
      ...defaultFilters,
      ...(sortFromUrl ? { sort: sortFromUrl } : {}),
    };
  }, [defaultFilters, searchParams]);

  const [applied, setApplied] = useState<CollectionFilterState>(initialFilters);
  const [draft, setDraft] = useState<CollectionFilterState>(initialFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(
    () => filterAndSortProducts(products, applied),
    [products, applied],
  );

  const openDrawer = () => {
    setDraft(applied);
    setDrawerOpen(true);
  };

  const syncSortToUrl = useCallback(
    (filters: CollectionFilterState) => {
      const query = sortOptionToQuery(filters.sort);
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("sort_by", query);
      else params.delete("sort_by");
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  const handleApply = () => {
    setApplied(draft);
    syncSortToUrl(draft);
    setDrawerOpen(false);
  };

  const handleClear = () => {
    const cleared = createDefaultFilters(products);
    setDraft(cleared);
    setApplied(cleared);
    syncSortToUrl(cleared);
  };

  const colClass =
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 lg:gap-x-5 lg:gap-y-10";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10 border-b border-neutral-200 pb-6">
        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-neutral-900 hover:opacity-70 transition-opacity text-left"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
          Filter and sort
        </button>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className={colClass}>
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600 py-16">
          No products match your filters. Try adjusting filters or{" "}
          <button
            type="button"
            onClick={handleClear}
            className="underline underline-offset-2"
          >
            clear all
          </button>
          .
        </p>
      )}

      <CollectionFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        products={products}
        draft={draft}
        onDraftChange={setDraft}
        onApply={handleApply}
        onClear={handleClear}
      />
    </>
  );
}
