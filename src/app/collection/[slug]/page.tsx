import { SiteImage } from "@/components/site-image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteContainer } from "@/components/site-container";
import { Suspense } from "react";
import { CollectionProductList } from "@/components/collection-product-list";
import {
  getAllCollectionSlugs,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/data/data";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const products = getProductsByCollection(slug);
  const name =
    collection?.name ??
    products[0]?.collectionName ??
    slug.replace(/-/g, " ");

  return buildMetadata({
    title: name,
    description:
      collection?.description ??
      `Shop ${name} at ${siteConfig.brandName}. Pakistani designer outfits with international shipping.`,
    path: `/collection/${slug}`,
    image: collection?.image ?? products[0]?.image,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const products = getProductsByCollection(slug);

  if (!collection && products.length === 0) notFound();

  const title =
    collection?.name ?? products[0]?.collectionName ?? "Collection";
  const description =
    collection?.description ??
    `Browse our ${title} collection — premium Pakistani designer fashion.`;

  return (
    <SiteContainer className="py-8 lg:py-12">
      <Breadcrumbs items={[{ label: title }]} />

      {collection?.image && (
        <div className="relative aspect-[21/7] mb-10 overflow-hidden bg-neutral-100">
          <SiteImage
            src={collection.image}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-white text-2xl sm:text-4xl uppercase tracking-[0.2em] font-light text-center px-4">
              {title}
            </h1>
          </div>
        </div>
      )}

      {!collection?.image && (
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light">
            {title}
          </h1>
          <p className="mt-4 text-sm text-neutral-600 max-w-xl mx-auto">
            {description}
          </p>
        </header>
      )}

      {products.length > 0 ? (
        <Suspense
          fallback={
            <p className="text-center text-neutral-500 py-12 text-sm uppercase tracking-widest">
              Loading products…
            </p>
          }
        >
          <CollectionProductList products={products} />
        </Suspense>
      ) : (
        <p className="text-center text-neutral-600 py-16">
          No products in this collection yet. Check back soon.
        </p>
      )}
    </SiteContainer>
  );
}
