import { apiClient } from "@/service";
import type { Customer, CustomerAddress } from "@/types";

const ME_ENDPOINT = "/api/customers/me";
const ADDRESSES_ENDPOINT = "/api/customers/me/addresses";

export function normalizeCustomerProfile(data: any): {
  customer: Customer | null;
  orders: any[];
  ordersTotal: number;
  ordersTotalAmount: string | null;
  addresses: CustomerAddress[];
  addressesTotal: number;
} {
  const root = data?.data ?? data;

  return {
    customer: root?.customer ?? null,
    orders: root?.orders?.list ?? [],
    ordersTotal: root?.orders?.total ?? 0,
    ordersTotalAmount: root?.orders?.totalAmount ?? null,
    addresses: root?.addresses?.list ?? [],
    addressesTotal: root?.addresses?.total ?? 0,
  };
}

export function normalizeAddressResponse(data: any): CustomerAddress | null {
  const address = data?.data ?? data;
  if (!address?.id) return null;
  return address as CustomerAddress;
}

export const customerService = {
  getMe(): Promise<any> {
    return apiClient.get<any>(ME_ENDPOINT);
  },

  createAddress(payload: any): Promise<any> {
    return apiClient.post<any>(ADDRESSES_ENDPOINT, payload);
  },

  updateAddress(id: string, payload: any): Promise<any> {
    return apiClient.put<any>(`${ADDRESSES_ENDPOINT}/${encodeURIComponent(id)}`, payload);
  },

  deleteAddress(id: string): Promise<any> {
    return apiClient.delete<any>(`${ADDRESSES_ENDPOINT}/${encodeURIComponent(id)}`);
  },
};
