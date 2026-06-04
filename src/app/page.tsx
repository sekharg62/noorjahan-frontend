import { CategoryGrid } from "@/components/category-grid";
import { HeroBanner } from "@/components/hero-banner";
import { ProductGrid } from "@/components/product-grid";
import { getFeaturedProducts } from "@/data/data";

export default function HomePage() {
  const products = getFeaturedProducts();

  return (
    <>
      <HeroBanner />
      <ProductGrid products={products} title="Featured Collection" />
      <CategoryGrid />
    </>
  );
}
