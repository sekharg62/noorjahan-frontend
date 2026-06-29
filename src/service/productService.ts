import { publicApi } from "@/service";

const PRODUCTS_ENDPOINT = "/api/products";

export function normalizeProductsResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function normalizeProductResponse(data: any): any | null {
  if (data?.id && data?.slug) return data;
  if (data?.data?.id && data?.data?.slug) return data.data;
  if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

export const productService = {
  getByCategory(category: string): Promise<any> {
    return publicApi.get<any>(
      `${PRODUCTS_ENDPOINT}?category=${encodeURIComponent(category)}`,
    );
  },

  getBySlug(slug: string): Promise<any> {
    return publicApi.get<any>(
      `${PRODUCTS_ENDPOINT}/${encodeURIComponent(slug)}`,
    );
  },
};
