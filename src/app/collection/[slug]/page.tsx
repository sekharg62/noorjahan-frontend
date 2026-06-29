import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionProducts } from "@/components/collection-products";
import { SiteContainer } from "@/components/site-container";
import { getCollectionTitleFromNavigation } from "@/lib/menu-navigation";
import { menuSubmenuService } from "@/service/menuSubmenuService";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

function formatCategoryTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getCategoryTitle(slug: string): Promise<string> {
  try {
    const response = await menuSubmenuService.getAll();
    const title = getCollectionTitleFromNavigation(response, slug);
    if (title) return title;
  } catch {
    // Fall back to formatted slug when menu API is unavailable.
  }

  return formatCategoryTitle(slug);
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const title = await getCategoryTitle(slug);

  return buildMetadata({
    title,
    description: `Shop ${title} at ${siteConfig.brandName}. Pakistani designer outfits with international shipping.`,
    path: `/collection/${slug}`,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  const title = await getCategoryTitle(slug);

  return (
    <SiteContainer className="py-8 lg:py-12">
      <Breadcrumbs items={[{ label: title }]} />

      <header className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light">
          {title}
        </h1>
        <p className="mt-4 text-sm text-neutral-600 max-w-xl mx-auto">
          Browse our {title} collection — premium Pakistani designer fashion.
        </p>
      </header>

      <CollectionProducts category={slug} />
    </SiteContainer>
  );
}
