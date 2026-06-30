"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckoutAddressSection } from "@/components/checkout-address-section";
import { SiteContainer } from "@/components/site-container";
import { useAuth } from "@/context/auth-context";
import { accountCopy } from "@/data/static-pages";

export function AccountAddressesView() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const copy = accountCopy.manageAddresses;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <SiteContainer className="py-16 text-center text-sm text-neutral-500">
        {accountCopy.profile.loading}
      </SiteContainer>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <SiteContainer className="py-12 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-xl sm:text-2xl uppercase tracking-[0.2em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-center text-sm text-neutral-600">{copy.subtitle}</p>
        <p className="mt-6 text-center text-sm text-neutral-600">
          <Link
            href="/account/profile"
            className="underline underline-offset-2 hover:opacity-70"
          >
            {copy.backToProfile}
          </Link>
        </p>

        <div className="mt-10">
          <CheckoutAddressSection mode="manage" />
        </div>
      </div>
    </SiteContainer>
  );
}
