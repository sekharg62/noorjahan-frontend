import { apiClient, publicApi } from "@/service";
import type { CartItem, MobilePaymentDetails, PaymentMethod } from "@/types";
import { findProductSize } from "@/lib/product-sizes";

const ORDERS_ENDPOINT = "/api/orders";

export type ApiPaymentMethod = PaymentMethod;

interface OrderPaymentPayload {
  paymentMethod: ApiPaymentMethod;
  paymentSenderNumber?: string;
  paymentTransactionId?: string;
}

function buildPaymentPayload(
  paymentMethod: ApiPaymentMethod,
  paymentDetails?: MobilePaymentDetails,
): OrderPaymentPayload {
  const payload: OrderPaymentPayload = { paymentMethod };

  if (
    paymentMethod === "BKASH" ||
    paymentMethod === "NAGAD" ||
    paymentMethod === "ROCKET"
  ) {
    payload.paymentSenderNumber = paymentDetails?.senderNumber.trim();
    payload.paymentTransactionId = paymentDetails?.transactionId.trim();
  }

  return payload;
}

export function mapCartItemsToOrderItems(items: CartItem[]) {
  return items.map(({ product, quantity, size, sizeId }) => {
    const resolvedSizeId =
      sizeId || findProductSize(product, size)?.sizeId || "";

    if (!resolvedSizeId) {
      throw new Error(`Missing size for ${product.name}`);
    }

    return {
      productId: product.id,
      sizeId: resolvedSizeId,
      quantity,
    };
  });
}

export function buildGuestOrderPayload(params: {
  address: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine: string;
    city: string;
    postalCode: string;
  };
  phone: string;
  items: CartItem[];
  paymentMethod?: ApiPaymentMethod;
  paymentDetails?: MobilePaymentDetails;
}): {
  paymentMethod: ApiPaymentMethod;
  paymentSenderNumber?: string;
  paymentTransactionId?: string;
  guest: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: Array<{ productId: string; sizeId: string; quantity: number }>;
} {
  const { address, phone, items, paymentMethod = "COD", paymentDetails } = params;

  return {
    ...buildPaymentPayload(paymentMethod, paymentDetails),
    guest: {
      name: address.fullName,
      phone,
      ...(address.email ? { email: address.email } : {}),
      address: address.addressLine,
      city: address.city,
      pincode: address.postalCode,
    },
    items: mapCartItemsToOrderItems(items),
  };
}

export function buildCustomerOrderPayload(params: {
  addressId: string;
  items: CartItem[];
  paymentMethod?: ApiPaymentMethod;
  paymentDetails?: MobilePaymentDetails;
}): {
  paymentMethod: ApiPaymentMethod;
  paymentSenderNumber?: string;
  paymentTransactionId?: string;
  addressId: string;
  items: Array<{ productId: string; sizeId: string; quantity: number }>;
} {
  return {
    ...buildPaymentPayload(
      params.paymentMethod ?? "COD",
      params.paymentDetails,
    ),
    addressId: params.addressId,
    items: mapCartItemsToOrderItems(params.items),
  };
}

export function extractOrderNo(response: any): string | null {
  return response?.data?.orderNo ?? response?.orderNo ?? null;
}

export const orderService = {
  placeGuestOrder(payload: ReturnType<typeof buildGuestOrderPayload>): Promise<any> {
    return publicApi.post<any>(ORDERS_ENDPOINT, payload);
  },

  placeCustomerOrder(
    payload: ReturnType<typeof buildCustomerOrderPayload>,
  ): Promise<any> {
    return apiClient.post<any>(ORDERS_ENDPOINT, payload);
  },
};
