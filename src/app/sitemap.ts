import type { MetadataRoute } from "next";
import {
  getAllCollectionSlugs,
  getAllProductSlugs,
} from "@/data/data";
import { getAllStaticPageSlugs } from "@/data/static-pages";
import { siteConfig } from "@/lib/site-config";

const extraRoutes = ["", "/cart"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.seo.siteUrl;

  const routes: MetadataRoute.Sitemap = [
    ...extraRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
    ...getAllStaticPageSlugs().map((slug) => ({
      url: `${base}/pages/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  getAllProductSlugs().forEach((slug) => {
    routes.push({
      url: `${base}/product/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  getAllCollectionSlugs().forEach((slug) => {
    routes.push({
      url: `${base}/collection/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  return routes;
}
