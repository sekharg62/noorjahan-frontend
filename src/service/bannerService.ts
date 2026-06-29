import { publicApi } from "@/service";

const BANNERS_ENDPOINT = "/api/banners";

export const bannerService = {
  getAll(): Promise<any> {
    return publicApi.get<any>(BANNERS_ENDPOINT);
  },
};
