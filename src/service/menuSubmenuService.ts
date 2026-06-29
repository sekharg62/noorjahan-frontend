import { publicApi } from "@/service";

const MENU_SUBMENU_ENDPOINT = "/api/menu-submenu";

export const menuSubmenuService = {
  getAll(): Promise<any[]> {
    return publicApi.get<any[]>(MENU_SUBMENU_ENDPOINT);
  },
};
