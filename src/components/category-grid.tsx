import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { SiteContainer } from "@/components/site-container";
import { collections, featuredCollectionSlugs } from "@/data/data";

export function CategoryGrid() {
  const featured = collections.filter((c) =>
    featuredCollectionSlugs.includes(c.slug),
  );

  return (
    <section className="py-12 lg:py-16">
      <h2 className="text-center text-sm uppercase tracking-[0.3em] text-neutral-900 mb-8 lg:mb-12">
        Shop By Category
      </h2>
      <SiteContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {featured.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collection/${collection.slug}`}
            className="group relative aspect-[4/3] overflow-hidden bg-neutral-100"
          >
            <SiteImage
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl uppercase tracking-[0.2em] font-light">
              {collection.name}
            </span>
          </Link>
        ))}
      </SiteContainer>
    </section>
  );
}
