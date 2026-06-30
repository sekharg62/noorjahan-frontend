import { apiClient, publicApi } from "@/service";
import type { CartItem, ShippingAddress } from "@/types";

const ORDERS_ENDPOINT = "/api/orders";

export function buildGuestOrderPayload(params: {
  address: ShippingAddress;
  phoneLocal: string;
  items: CartItem[];
}): any {
  const { address, phoneLocal, items } = params;

  return {
    guest: {
      name: address.fullName,
      phone: phoneLocal,
      email: address.email || undefined,
      address: address.district
        ? `${address.addressLine}, ${address.district}`
        : address.addressLine,
      city: address.city,
      pincode: address.postalCode,
    },
    paymentMethod: "COD",
    items: items.map(({ product, quantity, size }) => ({
      productId: product.id,
      quantity,
      size,
    })),
  };
}

export function buildCustomerOrderPayload(params: {
  addressId: string;
  items: CartItem[];
}): any {
  return {
    addressId: params.addressId,
    paymentMethod: "COD",
    items: params.items.map(({ product, quantity, size }) => ({
      productId: product.id,
      quantity,
      size,
    })),
  };
}

export function extractOrderNo(response: any): string | null {
  return response?.data?.orderNo ?? response?.orderNo ?? null;
}

export const orderService = {
  placeGuestOrder(payload: any): Promise<any> {
    return publicApi.post<any>(ORDERS_ENDPOINT, payload);
  },

  placeCustomerOrder(payload: any): Promise<any> {
    return apiClient.post<any>(ORDERS_ENDPOINT, payload);
  },
};
