export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
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
  sizes: string[];
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

export type PaymentMethod = "cod";

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: "placed";
}
