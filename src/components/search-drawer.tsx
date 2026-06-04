"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { searchProducts } from "@/data/data";
import { useSearchPanel } from "@/context/search-context";
import { formatPrice } from "@/lib/site-config";

export function SearchDrawer() {
  const { isOpen, closeSearch } = useSearchPanel();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      window.clearTimeout(timer);
    };
  }, [isOpen, closeSearch]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeSearch}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center gap-2 p-4 sm:p-5 border-b">
          <form
            className="flex flex-1 items-center gap-2 min-w-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="search-drawer-input" className="sr-only">
              Search products
            </label>
            <Search
              className="w-5 h-5 text-neutral-500 shrink-0"
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              id="search-drawer-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 min-w-0 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              autoComplete="off"
            />
          </form>
          <button
            type="button"
            onClick={closeSearch}
            className="p-2 shrink-0 text-neutral-700 hover:text-neutral-900 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <p className="text-sm text-neutral-500 text-center py-12">
              Search by product name, collection, or style.
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-neutral-600 text-center py-12">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <ul className="space-y-4">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-16 h-20 flex-shrink-0 bg-neutral-100 overflow-hidden">
                        <SiteImage
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-sm font-medium text-neutral-900 group-hover:underline line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {product.collectionName}
                        </p>
                        <p className="text-sm text-neutral-700 mt-1">
                          {formatPrice(product.price)}
                          {product.soldOut && (
                            <span className="ml-2 text-[10px] uppercase tracking-widest text-neutral-400">
                              Sold out
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
