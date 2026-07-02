import { checkoutCopy } from "@/data/static-pages";
import type { PaymentMethod } from "@/types";

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "COD":
      return checkoutCopy.paymentCod;
    case "BKASH":
      return checkoutCopy.paymentBkash;
    case "NAGAD":
      return checkoutCopy.paymentNagad;
    case "ROCKET":
      return checkoutCopy.paymentRocket;
    default:
      return method;
  }
}

export function isOnlinePaymentMethod(
  method: PaymentMethod,
): method is "BKASH" | "NAGAD" | "ROCKET" {
  return method === "BKASH" || method === "NAGAD" || method === "ROCKET";
}
