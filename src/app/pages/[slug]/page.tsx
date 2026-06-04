import { notFound } from "next/navigation";
import { StaticPageView } from "@/components/static-page-view";
import {
  getAllStaticPageSlugs,
  getStaticPageBySlug,
} from "@/data/static-pages";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllStaticPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getStaticPageBySlug(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/pages/${slug}`,
  });
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getStaticPageBySlug(slug);
  if (!page) notFound();

  return <StaticPageView page={page} />;
}
