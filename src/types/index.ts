export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt?: string;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  alternativePh?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface ProductSize {
  id: string;
  sizeId: string;
  label: string;
  sortOrder: number;
  description?: string | null;
  stock: number;
  sku?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  collectionSlug: string;
  collectionName: string;
  image: string;
  images: string[];
  soldOut?: boolean;
  description: string;
  tags: string[];
  sku: string;
  sizes: ProductSize[];
  totalStock: number;
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  parentNav?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface HeroSlide {
  title: string;
  subtitle?: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  sizeId: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode: string;
}

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "ROCKET";

export type OnlinePaymentMethod = "BKASH" | "NAGAD" | "ROCKET";

export interface MobilePaymentDetails {
  senderNumber: string;
  transactionId: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentDetails?: MobilePaymentDetails;
  subtotal: number;
  shipping: number;
  total: number;
  status: "placed";
}
