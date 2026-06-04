"use client";

import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { SiteContainer } from "@/components/site-container";
import { checkoutCopy } from "@/data/static-pages";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <SiteContainer className="py-16 text-center">
        <p className="text-sm text-neutral-600">{checkoutCopy.emptyCart}</p>
        <div className="mt-6 flex flex-col gap-3 items-center">
          <Link
            href="/cart"
            className="text-sm underline underline-offset-2 hover:opacity-70"
          >
            View cart
          </Link>
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            {checkoutCopy.continueShopping}
          </Link>
        </div>
      </SiteContainer>
    );
  }

  return (
    <SiteContainer className="py-10 lg:py-16">
      <h1 className="text-center text-sm uppercase tracking-[0.3em] font-bold text-neutral-900 mb-2">
        {checkoutCopy.title}
      </h1>
      <p className="text-center text-sm text-neutral-600 mb-10">
        <Link href="/cart" className="underline underline-offset-2 hover:opacity-70">
          ← Back to cart
        </Link>
      </p>
      <CheckoutForm />
    </SiteContainer>
  );
}
