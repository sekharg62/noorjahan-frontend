import siteConfigJson from "@/config/siteConfig.json";

export type SiteConfig = typeof siteConfigJson;

export const siteConfig: SiteConfig = siteConfigJson;

export function getWhatsAppUrl(message?: string): string {
  const phone = siteConfig.contact.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(amount: number): string {
  return `${siteConfig.shipping.currencySymbol}${amount.toFixed(2)}`;
}

export function formatFreeShippingThreshold(): string {
  return formatPrice(siteConfig.shipping.freeShippingThreshold);
}

/** Replaces `{{threshold}}` in announcement copy with the configured currency amount. */
export function formatAnnouncementText(text: string): string {
  return text.replace(/\{\{threshold\}\}/gi, formatFreeShippingThreshold());
}
