import type { Product } from "@/types";
import { getProductSizeLabels } from "@/lib/product-sizes";

export type CollectionSortOption =
  | "featured"
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";

export const COLLECTION_SORT_OPTIONS: {
  value: CollectionSortOption;
  label: string;
}[] = [
  { value: "featured", label: "Featured" },
  { value: "title-asc", label: "Alphabetically, A-Z" },
  { value: "title-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-asc", label: "Date, old to new" },
  { value: "date-desc", label: "Date, new to old" },
];

export const SORT_BY_QUERY_MAP: Record<string, CollectionSortOption> = {
  "created-descending": "date-desc",
  "created-ascending": "date-asc",
  "price-ascending": "price-asc",
  "price-descending": "price-desc",
  "title-ascending": "title-asc",
  "title-descending": "title-desc",
};

export interface CollectionFilterState {
  inStockOnly: boolean;
  priceMin: number;
  priceMax: number;
  sizes: string[];
  sort: CollectionSortOption;
}

export function getPriceBounds(products: Product[]) {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "FREE SIZE"];

export function getCollectionSizeOptions(products: Product[]): string[] {
  const set = new Set<string>();
  for (const product of products) {
    for (const size of getProductSizeLabels(product)) {
      set.add(size.toUpperCase() === "FREE SIZE" ? "FREE SIZE" : size.toUpperCase());
    }
  }
  return [...set].sort(
    (a, b) =>
      (SIZE_ORDER.indexOf(a) === -1 ? 99 : SIZE_ORDER.indexOf(a)) -
      (SIZE_ORDER.indexOf(b) === -1 ? 99 : SIZE_ORDER.indexOf(b)),
  );
}

export function countProductsWithSize(products: Product[], size: string): number {
  const normalized = size.toUpperCase();
  return products.filter((p) =>
    getProductSizeLabels(p).some((s) => s.toUpperCase() === normalized),
  ).length;
}

export function createDefaultFilters(products: Product[]): CollectionFilterState {
  const { min, max } = getPriceBounds(products);
  return {
    inStockOnly: false,
    priceMin: min,
    priceMax: max,
    sizes: [],
    sort: "date-desc",
  };
}

export function sortProducts(
  items: Product[],
  sort: CollectionSortOption,
): Product[] {
  const list = [...items];
  switch (sort) {
    case "title-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "title-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "date-asc":
      return list.sort((a, b) => a.id.localeCompare(b.id));
    case "date-desc":
      return list.sort((a, b) => b.id.localeCompare(a.id));
    case "featured":
    default:
      return list;
  }
}

export function filterAndSortProducts(
  products: Product[],
  filters: CollectionFilterState,
): Product[] {
  let result = [...products];

  if (filters.inStockOnly) {
    result = result.filter((p) => !p.soldOut);
  }

  result = result.filter(
    (p) => p.price >= filters.priceMin && p.price <= filters.priceMax,
  );

  if (filters.sizes.length > 0) {
    const selected = new Set(filters.sizes.map((s) => s.toUpperCase()));
    result = result.filter((p) =>
      getProductSizeLabels(p).some((s) => selected.has(s.toUpperCase())),
    );
  }

  return sortProducts(result, filters.sort);
}

export function sortOptionToQuery(sort: CollectionSortOption): string | null {
  const entry = Object.entries(SORT_BY_QUERY_MAP).find(([, v]) => v === sort);
  return entry?.[0] ?? null;
}

export function sortOptionFromQuery(
  sortBy: string | null,
): CollectionSortOption | undefined {
  if (!sortBy) return undefined;
  return SORT_BY_QUERY_MAP[sortBy];
}
