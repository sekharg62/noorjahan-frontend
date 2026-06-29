import { publicApi } from "@/service";

const PRODUCTS_ENDPOINT = "/api/products";

export function normalizeProductsResponse(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const productService = {
  getByCategory(category: string): Promise<any> {
    return publicApi.get<any>(
      `${PRODUCTS_ENDPOINT}?category=${encodeURIComponent(category)}`,
    );
  },
};
