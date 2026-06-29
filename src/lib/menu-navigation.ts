import type { NavItem } from "@/types";

function collectionHref(slug: string): string {
  return `/collection/${slug}`;
}

function normalizeMenuSubmenus(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.menus)) return data.data.menus;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.menus)) return data.menus;
  return [];
}

export function mapMenuSubmenusToNavigation(menuSubmenus: any[]): NavItem[] {
  if (!Array.isArray(menuSubmenus)) return [];

  return menuSubmenus.map((item) => ({
    label: item.name,
    href: collectionHref(item.slug),
    children: item.children?.map((child: any) => ({
      label: child.name,
      href: collectionHref(child.slug),
    })),
  }));
}

export function getCollectionTitleFromNavigation(
  menuResponse: any,
  slug: string,
): string | null {
  const menus = normalizeMenuSubmenus(menuResponse);

  for (const menu of menus) {
    if (menu.slug === slug) return menu.name;

    const child = menu.children?.find((item: any) => item.slug === slug);
    if (child) return child.name;
  }

  return null;
}
