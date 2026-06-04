"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { searchProducts } from "@/data/data";

export function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <>
      <form
        className="max-w-xl mx-auto flex gap-2 mb-10"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem("q") as HTMLInputElement;
          setQuery(input.value);
        }}
      >
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="Search products..."
          className="flex-1 border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-900"
        />
        <button
          type="submit"
          className="bg-neutral-900 text-white px-5 flex items-center gap-2 text-xs uppercase tracking-widest hover:bg-neutral-800"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      {query && results.length === 0 && (
        <p className="text-center text-neutral-600">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <ProductGrid
          products={results}
          title={`${results.length} result${results.length === 1 ? "" : "s"}`}
        />
      )}
    </>
  );
}
