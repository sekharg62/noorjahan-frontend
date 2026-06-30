"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { accountCopy } from "@/data/static-pages";
import { SiteContainer } from "@/components/site-container";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(isAuthenticated ? "/account/profile" : "/account/login");
  }, [isAuthenticated, loading, router]);

  return (
    <SiteContainer className="py-16 text-center text-sm text-neutral-500">
      {accountCopy.profile.loading}
    </SiteContainer>
  );
}
