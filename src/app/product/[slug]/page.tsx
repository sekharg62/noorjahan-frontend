import { ProductPageContent } from "@/components/product-page-content";
import {
  mapApiProductResponseToProduct,
} from "@/lib/map-api-products";
import { productService } from "@/service/productService";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductForMetadata(slug: string) {
  try {
    const response = await productService.getBySlug(slug);
    return mapApiProductResponseToProduct(response);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductForMetadata(slug);
  if (!product) {
    return buildMetadata({
      title: "Product",
      description: "View product details at NOORJAHAN.",
      path: `/product/${slug}`,
    });
  }

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

  return <ProductPageContent slug={slug} />;
}
