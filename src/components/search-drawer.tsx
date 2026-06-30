"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { SoldOutRibbon } from "@/components/sold-out-ribbon";
import { useSearchPanel } from "@/context/search-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { mapApiProductsSearchResponse } from "@/lib/map-api-products";
import { formatPrice } from "@/lib/site-config";
import { productService } from "@/service/productService";
import type { Product } from "@/types";

const SEARCH_DEBOUNCE_MS = 350;

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string; code?: string };
  return err.name === "AbortError" || err.name === "CanceledError" || err.code === "ERR_CANCELED";
}

function SearchResultSkeleton() {
  return (
    <ul className="space-y-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <li key={`search-skeleton-${index}`} className="flex gap-3 animate-pulse">
          <div className="w-16 h-20 shrink-0 bg-neutral-200" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 w-3/4 bg-neutral-200 rounded-sm" />
            <div className="h-3 w-1/2 bg-neutral-200 rounded-sm" />
            <div className="h-3.5 w-1/4 bg-neutral-200 rounded-sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SearchDrawer() {
  const { isOpen, closeSearch } = useSearchPanel();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = query.trim();
  const isDebouncing = trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;
  const isSearching = loading || isDebouncing;

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
    if (!isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setResults([]);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    productService
      .search(debouncedQuery, { signal: controller.signal })
      .then((data) => {
        if (cancelled) return;
        setResults(mapApiProductsSearchResponse(data));
      })
      .catch((err) => {
        if (cancelled || isAbortError(err)) return;
        setError(getApiErrorMessage(err, "Could not search products. Please try again."));
        setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery]);

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

        <div
          className="flex-1 overflow-y-auto p-4 sm:p-5"
          aria-busy={isSearching}
          aria-live="polite"
        >
          {!trimmedQuery ? (
            <p className="text-sm text-neutral-500 text-center py-12">
              Search by product name, collection, or style.
            </p>
          ) : isSearching ? (
            <SearchResultSkeleton />
          ) : error ? (
            <p className="text-sm text-red-600 text-center py-12" role="alert">
              {error}
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-neutral-600 text-center py-12">
              No results for &ldquo;{debouncedQuery}&rdquo;
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
                      <div className="relative w-16 h-20 shrink-0 bg-neutral-100 overflow-hidden">
                        {product.image ? (
                          <SiteImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-neutral-200" aria-hidden />
                        )}
                        {product.soldOut && <SoldOutRibbon size="xs" />}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="text-sm font-medium text-neutral-900 group-hover:underline line-clamp-2">
                          {product.name}
                        </p>
                        {product.collectionName && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {product.collectionName}
                          </p>
                        )}
                        <p className="text-sm text-neutral-700 mt-1">
                          {formatPrice(product.price)}
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
