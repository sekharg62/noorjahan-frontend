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

function getProductImageUrls(item: any): string[] {
  const images = getProductImages(item);
  const urls = images.map((image) => image.imgUrl).filter(Boolean);
  if (urls.length > 0) return urls;
  if (item?.primaryImage?.imgUrl) return [item.primaryImage.imgUrl];
  return [];
}

function getCollectionInfo(item: any, categorySlug?: string) {
  if (item.menuSubmenu) {
    const slug = item.menuSubmenu.slug ?? categorySlug ?? "";
    return {
      collectionSlug: slug,
      collectionName:
        item.menuSubmenu.name ?? formatCategoryName(slug),
    };
  }

  if (item.category) {
    const slug = item.category.slug ?? categorySlug ?? "";
    const categoryName = item.category.name ?? formatCategoryName(slug);
    const parentName = item.category.parent?.name;
    return {
      collectionSlug: slug,
      collectionName: parentName
        ? `${parentName} / ${categoryName}`
        : categoryName,
    };
  }

  const slug = categorySlug ?? "";
  return {
    collectionSlug: slug,
    collectionName: formatCategoryName(slug),
  };
}

export function mapApiProductToProduct(
  item: any,
  categorySlug?: string,
): Product {
  const imageUrls = getProductImageUrls(item);
  const primaryImage = imageUrls[0] ?? "";
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
  const { collectionSlug, collectionName } = getCollectionInfo(item, categorySlug);

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

export function mapApiProductsSearchResponse(response: any): Product[] {
  return normalizeProductsResponse(response)
    .filter((item) => item?.isActive !== false)
    .map((item) => mapApiProductToProduct(item));
}
