import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { SiteContainer } from "@/components/site-container";

interface ProductGridProps {
  products: Product[];
  title?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  title = "Featured Collection",
  columns = 4,
}: ProductGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="py-10 lg:py-14">
      {title && (
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-neutral-900 mb-8 lg:mb-10">
          {title}
        </h2>
      )}
      <SiteContainer
        className={`grid ${colClass} gap-x-3 gap-y-8 sm:gap-x-4 lg:gap-x-5 lg:gap-y-10`}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </SiteContainer>
    </section>
  );
}
