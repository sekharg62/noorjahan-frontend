"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mapMenuSubmenusToNavigation } from "@/lib/menu-navigation";
import { menuSubmenuService } from "@/service/menuSubmenuService";
import type { NavItem } from "@/types";

let menuSubmenuPromise: Promise<any> | null = null;

function fetchMenuSubmenusOnce(): Promise<any> {
  if (!menuSubmenuPromise) {
    menuSubmenuPromise = menuSubmenuService.getAll();
  }
  return menuSubmenuPromise;
}

function normalizeMenuSubmenus(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.menus)) return data.data.menus;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.menus)) return data.menus;
  return [];
}

interface MenuSubmenuContextValue {
  menuSubmenus: any[];
  navigation: NavItem[];
  loading: boolean;
  error: unknown;
}

const MenuSubmenuContext = createContext<MenuSubmenuContextValue | null>(null);

export function MenuSubmenuProvider({ children }: { children: React.ReactNode }) {
  const [menuSubmenus, setMenuSubmenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    fetchMenuSubmenusOnce()
      .then((data) => setMenuSubmenus(normalizeMenuSubmenus(data)))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const navigation = useMemo(
    () => mapMenuSubmenusToNavigation(menuSubmenus),
    [menuSubmenus],
  );

  const value = useMemo(
    () => ({ menuSubmenus, navigation, loading, error }),
    [menuSubmenus, navigation, loading, error],
  );

  return (
    <MenuSubmenuContext.Provider value={value}>
      {children}
    </MenuSubmenuContext.Provider>
  );
}

export function useMenuSubmenu(): MenuSubmenuContextValue {
  const context = useContext(MenuSubmenuContext);
  if (!context) {
    throw new Error("useMenuSubmenu must be used within MenuSubmenuProvider");
  }
  return context;
}
