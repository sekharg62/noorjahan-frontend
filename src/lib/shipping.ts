import { LOCAL_FLAT_SHIPPING } from "@/data/static-pages";
import { siteConfig } from "@/lib/site-config";

export function calculateShippingFee(subtotal: number): number {
  if (subtotal >= siteConfig.shipping.freeShippingThreshold) {
    return 0;
  }
  return LOCAL_FLAT_SHIPPING;
}
