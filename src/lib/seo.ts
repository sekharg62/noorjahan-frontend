import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  keywords,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : siteConfig.seo.defaultTitle;
  const pageDescription = description ?? siteConfig.seo.defaultDescription;
  const url = `${siteConfig.seo.siteUrl}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteConfig.seo.siteUrl}${image}`
    : `${siteConfig.seo.siteUrl}${siteConfig.seo.ogImage}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords ?? siteConfig.seo.keywords,
    metadataBase: new URL(siteConfig.seo.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.brandName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
      site: siteConfig.seo.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  image: string;
  slug: string;
  price: number;
  sku: string;
  soldOut?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    url: `${siteConfig.seo.siteUrl}/product/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.shipping.currency,
      price: product.price,
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${siteConfig.seo.siteUrl}/product/${product.slug}`,
    },
  };
}
