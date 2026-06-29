import type { Product } from "@/types";
import {
  normalizeProductResponse,
  normalizeProductsResponse,
} from "@/service/productService";

function formatCategoryName(categorySlug: string): string {
  return categorySlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getProductImages(item: any): any[] {
  if (!Array.isArray(item?.images)) return [];
  return [...item.images].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );
}

export function mapApiProductToProduct(
  item: any,
  categorySlug?: string,
): Product {
  const images = getProductImages(item);
  const primaryImage =
    images.find((image) => image.isPrimary)?.imgUrl ?? images[0]?.imgUrl ?? "";
  const imageUrls = images.map((image) => image.imgUrl).filter(Boolean);
  const listPrice = Number(item.price) || 0;
  const offerPrice =
    item.offerPrice != null && item.offerPrice !== ""
      ? Number(item.offerPrice)
      : null;
  const price =
    offerPrice != null && !Number.isNaN(offerPrice) ? offerPrice : listPrice;
  const compareAtPrice =
    offerPrice != null &&
    !Number.isNaN(offerPrice) &&
    listPrice > offerPrice
      ? listPrice
      : undefined;
  const collectionSlug = item.menuSubmenu?.slug ?? categorySlug ?? "";
  const collectionName =
    item.menuSubmenu?.name ?? formatCategoryName(collectionSlug);

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    price,
    compareAtPrice,
    collectionSlug,
    collectionName,
    image: primaryImage,
    images: imageUrls.length > 0 ? imageUrls : primaryImage ? [primaryImage] : [],
    soldOut: item.stock <= 0 || item.isActive === false,
    description: item.description ?? "",
    tags: [],
    sku: item.id,
    sizes: ["S", "M", "L"],
  };
}

export function mapApiProductResponseToProduct(response: any): Product | null {
  const item = normalizeProductResponse(response);
  if (!item) return null;
  return mapApiProductToProduct(item);
}

export function mapApiProductsToProducts(
  response: any,
  categorySlug: string,
): Product[] {
  return normalizeProductsResponse(response)
    .filter((item) => item?.isActive !== false)
    .map((item) => mapApiProductToProduct(item, categorySlug));
}
