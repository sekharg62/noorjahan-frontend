import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductWishlistRow } from "@/components/product-wishlist-row";
import { WishlistButton } from "@/components/wishlist-button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteContainer } from "@/components/site-container";
import { ProductGrid } from "@/components/product-grid";
import {
  getAllProductSlugs,
  getProductBySlug,
  getProductsByCollection,
} from "@/data/data";
import { formatPrice, formatFreeShippingThreshold } from "@/lib/site-config";
import { buildMetadata, productJsonLd } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.image,
    keywords: [...product.tags, product.collectionName],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCollection(product.collectionSlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            <SiteImage
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <WishlistButton
              product={product}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 hover:bg-white shadow-sm"
              iconClassName="w-5 h-5"
            />
            {product.soldOut && (
              <span className="absolute top-4 left-4 bg-white text-neutral-900 text-xs uppercase tracking-widest px-3 py-1.5">
                Sold out
              </span>
            )}
          </div>

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
            <p className="mt-4 text-xl">{formatPrice(product.price)}</p>
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
