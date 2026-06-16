/** Product & banner images — dress/fashion placeholders for demo catalog */

const dress = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

/** Wide crop for hero carousel & category banners */
const dressBanner = (id: string) =>
  `https://images.unsplash.com/${id}?w=1920&q=85&fit=crop`;

export const images = {
  hero: dressBanner("photo-1515886657613-9f3515b0c78f"),
  heroSlides: [
    dressBanner("photo-1515886657613-9f3515b0c78f"), // fashion editorial
    dressBanner("photo-1490481651871-ab68de25d43d"), // summer outfit
    dressBanner("photo-1539105785876-4b854f49ab54"), // styled dress
    dressBanner("photo-1483985988355-763728e23f8b"), // fashion look
  ] as const,
  collections: {
    summer: dressBanner("photo-1490481651871-ab68de25d43d"),
    lawn: dressBanner("photo-1558618666-fcd25c85cd64"),
    prints: dressBanner("photo-1586108739149-7f2a1f7d3f6e"),
    spring: dressBanner("photo-1595777457583-f7759a1be395"),
    accessories: dressBanner("photo-1566174053879-31528523f8ae"),
    gift: dressBanner("photo-1617137968427-859148c107a0"),
  },
  /** Dummy dress / outfit / fabric photos (Unsplash) — one per product index */
  products: [
    dress("photo-1595777457583-f7759a1be395"), // floral dress
    dress("photo-1515372039744-b8f02a3ae446"), // summer dress
    dress("photo-1496747611176-843222e1e57c"), // outdoor dress
    dress("photo-1539008835657-9e8d968765c2"), // white dress
    dress("photo-1583496668980-8e498a4b4d24"), // fashion portrait
    dress("photo-1594633312681-425a7b956276"), // printed dress
    dress("photo-1617137968427-859148c107a0"), // colorful outfit
    dress("photo-1469334031218-e382a71b716b"), // editorial fashion
    dress("photo-1509631179647-ff1736d8ebb5"), // elegant dress
    dress("photo-1525507119450-b780ee4588f0"), // casual dress
    dress("photo-1572804013307-3ed9254f0a2a"), // fashion look
    dress("photo-1591047139829-d91aecb6caea"), // dress detail
    dress("photo-1485968579580-038782a30812"), // styled outfit
    dress("photo-1558618666-fcd25c85cd64"), // fabric textile
    dress("photo-1586108739149-7f2a1f7d3f6e"), // patterned fabric
    dress("photo-1620799140408-edc7cd654700"), // fabric rolls
    dress("photo-1566174053879-31528523f8ae"), // clothing rack
    dress("photo-1618354691373-d8519715c786"), // fashion dress
  ] as const,
} as const;

export function productImage(index: number): string {
  const pool = images.products;
  return pool[index % pool.length];
}
