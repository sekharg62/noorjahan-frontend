"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchPanel } from "@/context/search-context";

/** Legacy /search URL — open drawer and return home */
export default function SearchPage() {
  const router = useRouter();
  const { openSearch } = useSearchPanel();

  useEffect(() => {
    openSearch();
    router.replace("/");
  }, [openSearch, router]);

  return null;
}
