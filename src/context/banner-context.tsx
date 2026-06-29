"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { bannerService } from "@/service/bannerService";

let bannersPromise: Promise<any> | null = null;

function fetchBannersOnce(): Promise<any> {
  if (!bannersPromise) {
    bannersPromise = bannerService.getAll();
  }
  return bannersPromise;
}

function normalizeBanners(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getHomeBanners(banners: any[]): any[] {
  return banners
    .filter((banner) => banner.type === "HOME")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

interface BannerContextValue {
  banners: any[];
  homeBanners: any[];
  loading: boolean;
  error: unknown;
}

const BannerContext = createContext<BannerContextValue | null>(null);

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    fetchBannersOnce()
      .then((data) => setBanners(normalizeBanners(data)))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const homeBanners = useMemo(() => getHomeBanners(banners), [banners]);

  const value = useMemo(
    () => ({ banners, homeBanners, loading, error }),
    [banners, homeBanners, loading, error],
  );

  return (
    <BannerContext.Provider value={value}>{children}</BannerContext.Provider>
  );
}

export function useBanners(): BannerContextValue {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanners must be used within BannerProvider");
  }
  return context;
}
