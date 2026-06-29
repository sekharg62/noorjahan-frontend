import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductWishlistRow } from "@/components/product-wishlist-row";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { ProductImages } from "@/components/product-images";
import { SiteContainer } from "@/components/site-container";
import {
  mapApiProductResponseToProduct,
  mapApiProductsToProducts,
} from "@/lib/map-api-products";
import { formatPrice, formatFreeShippingThreshold } from "@/lib/site-config";
import { productService } from "@/service/productService";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import type { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await productService.getBySlug(slug);
    return mapApiProductResponseToProduct(response);
  } catch {
    return null;
  }
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (!product.collectionSlug) return [];

  try {
    const response = await productService.getByCategory(product.collectionSlug);
    return mapApiProductsToProducts(response, product.collectionSlug)
      .filter((item) => item.id !== product.id)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.image,
    keywords: [product.collectionName, product.name],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const jsonLd = productJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <p>International delivery available</p>
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
    </>
  );
}
