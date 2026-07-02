import type { Product, ProductSize } from "@/types";

export function createStaticProductSizes(
  labels: string[],
  defaultStock = 10,
): ProductSize[] {
  return labels.map((label, index) => ({
    id: `static-${label}-${index}`,
    sizeId: `static-size-${label}`,
    label,
    sortOrder: index + 1,
    description: null,
    stock: defaultStock,
    sku: null,
  }));
}

export function mapApiProductSizes(item: any): ProductSize[] {
  if (!Array.isArray(item?.sizes)) return [];

  return [...item.sizes]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((size) => ({
      id: String(size.id),
      sizeId: String(size.sizeId),
      label: String(size.label),
      sortOrder: Number(size.sortOrder) || 0,
      description: size.description ?? null,
      stock: Number(size.stock) || 0,
      sku: size.sku ?? null,
    }));
}

export function getProductTotalStock(
  item: { totalStock?: number; sizes?: ProductSize[] },
  sizes: ProductSize[],
): number {
  if (typeof item.totalStock === "number") return item.totalStock;
  return sizes.reduce((sum, size) => sum + size.stock, 0);
}

export function getProductSizeLabels(product: Product): string[] {
  return product.sizes.map((size) => size.label);
}

export function findProductSize(
  product: Product,
  label: string,
): ProductSize | undefined {
  return product.sizes.find(
    (size) => size.label.toLowerCase() === label.toLowerCase(),
  );
}

export function getDefaultSelectedSize(product: Product): string {
  const inStock = product.sizes.find((size) => size.stock > 0);
  return inStock?.label ?? product.sizes[0]?.label ?? "";
}

export function normalizeStoredProductSizes(sizes: unknown): ProductSize[] {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return createStaticProductSizes(["S", "M", "L"]);
  }

  if (typeof sizes[0] === "string") {
    return createStaticProductSizes(sizes as string[]);
  }

  return sizes as ProductSize[];
}
