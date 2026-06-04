/** Local product & banner photos in /public/images */

export const images = {
  hero: "/images/hero.jpg",
  heroSlides: [
    "/images/hero.jpg",
    "/images/collection-summer.jpg",
    "/images/collection-lawn.jpg",
    "/images/collection-prints.jpg",
  ] as const,
  collections: {
    summer: "/images/collection-summer.jpg",
    lawn: "/images/collection-lawn.jpg",
    prints: "/images/collection-prints.jpg",
    spring: "/images/collection-spring.jpg",
    accessories: "/images/collection-accessories.jpg",
    gift: "/images/collection-gift.jpg",
  },
  products: [
    "/images/product-01.jpg",
    "/images/product-02.jpg",
    "/images/product-03.jpg",
    "/images/product-04.jpg",
    "/images/product-05.jpg",
    "/images/product-06.jpg",
    "/images/product-07.jpg",
    "/images/product-08.jpg",
  ] as const,
} as const;

export function productImage(index: number): string {
  const pool = images.products;
  return pool[index % pool.length];
}
