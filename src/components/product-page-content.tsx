"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { ProductImages } from "@/components/product-images";
import { ProductWishlistRow } from "@/components/product-wishlist-row";
import { SiteContainer } from "@/components/site-container";
import {
  mapApiProductResponseToProduct,
  mapApiProductsToProducts,
} from "@/lib/map-api-products";
import { formatFreeShippingThreshold, formatPrice } from "@/lib/site-config";
import { productService } from "@/service/productService";
import type { Product } from "@/types";

interface ProductPageContentProps {
  slug: string;
}

function ProductPageSkeleton() {
  return (
    <SiteContainer className="py-8 lg:py-12 animate-pulse">
      <div className="h-4 w-48 bg-neutral-200 rounded-sm mb-8" />
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-3/4 bg-neutral-200" />
        <div className="space-y-4 lg:py-8">
          <div className="h-3 w-24 bg-neutral-200 rounded-sm" />
          <div className="h-8 w-3/4 bg-neutral-200 rounded-sm" />
          <div className="h-6 w-28 bg-neutral-200 rounded-sm" />
          <div className="h-20 w-full bg-neutral-200 rounded-sm" />
          <div className="h-12 w-full bg-neutral-200 rounded-sm" />
        </div>
      </div>
    </SiteContainer>
  );
}

export function ProductPageContent({ slug }: ProductPageContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setNotFoundState(false);
    setProduct(null);
    setRelated([]);

    productService
      .getBySlug(slug)
      .then(async (response) => {
        if (cancelled) return;

        const nextProduct = mapApiProductResponseToProduct(response);
        if (!nextProduct) {
          setNotFoundState(true);
          return;
        }

        setProduct(nextProduct);

        if (!nextProduct.collectionSlug) return;

        try {
          const relatedResponse = await productService.getByCategory(
            nextProduct.collectionSlug,
          );
          if (cancelled) return;

          setRelated(
            mapApiProductsToProducts(relatedResponse, nextProduct.collectionSlug)
              .filter((item) => item.id !== nextProduct.id)
              .slice(0, 4),
          );
        } catch {
          if (!cancelled) setRelated([]);
        }
      })
      .catch((error) => {
        if (cancelled) return;

        const status = error?.response?.status;
        if (status === 404) {
          setNotFoundState(true);
          return;
        }

        setNotFoundState(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <ProductPageSkeleton />;
  if (notFoundState || !product) notFound();

  return (
    <SiteContainer className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          {
            label: product.collectionName,
            href: `/collection/${product.collectionSlug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <ProductImages product={product} />

        <div className="lg:py-8">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            <Link
              href={`/collection/${product.collectionSlug}`}
              className="hover:text-neutral-900 transition-colors"
            >
              {product.collectionName}
            </Link>
          </p>
          <h1 className="mt-2 text-2xl lg:text-3xl font-serif text-neutral-900">
            {product.name}
          </h1>
          <p className="mt-4 text-xl">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="ml-2 text-base font-normal line-through text-neutral-400">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
            {product.totalStock > 0
              ? `${product.totalStock} in stock`
              : "Out of stock"}
          </p>
          <p className="mt-6 text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>
          <p className="mt-2 text-xs text-neutral-400">SKU: {product.sku}</p>

          <ProductWishlistRow product={product} />

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200 text-sm text-neutral-600 space-y-2">
            <p>Free shipping on orders over {formatFreeShippingThreshold()}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <ProductGrid
            products={related}
            title="You May Also Like"
            columns={4}
          />
        </div>
      )}
    </SiteContainer>
  );
}
