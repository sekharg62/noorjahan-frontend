import type { NavItem } from "@/types";

function collectionHref(slug: string): string {
  return `/collection/${slug}`;
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
