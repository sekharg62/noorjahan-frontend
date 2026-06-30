"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { SiteContainer } from "@/components/site-container";
import { checkoutCopy } from "@/data/static-pages";
import { getOrderById, loadLastOrderFromSession } from "@/lib/orders";
import { formatPrice } from "@/lib/site-config";
import type { Order } from "@/types";

interface CartOrderSuccessProps {
  orderId: string;
}

export function CartOrderSuccess({ orderId }: CartOrderSuccessProps) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const found =
      getOrderById(orderId) ?? loadLastOrderFromSession(orderId) ?? null;
    setOrder(found);
  }, [orderId]);

  const copy = checkoutCopy.success;
  const orderNo = order?.id ?? orderId;

  return (
    <SiteContainer className="max-w-lg py-12 lg:py-20">
      <div className="text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-white"
          aria-hidden
        >
          <Check className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl sm:text-3xl uppercase tracking-[0.15em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
          {copy.subtitle}
        </p>
        {order && (
          <div className="mt-8 border border-neutral-200 px-6 py-5 text-sm text-neutral-600 space-y-3">
            <p>
              <span className="font-bold text-neutral-900">{copy.orderId}:</span>{" "}
              <span className="font-mono text-neutral-900">{orderNo}</span>
            </p>
            <p className="text-xs text-neutral-500">{copy.trackHint}</p>
            <p>
              <span className="font-bold text-neutral-900">{copy.payment}:</span>{" "}
              {copy.paymentCod} — {formatPrice(order.total)}
            </p>
            <p className="text-xs text-neutral-500">{copy.step3Detail}</p>
          </div>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
          >
            {copy.continueShopping}
          </Link>
          <Link
            href={`/pages/track-order?orderNo=${encodeURIComponent(orderNo)}`}
            className="inline-block border border-neutral-900 px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-neutral-50 transition-colors"
          >
            {copy.trackOrder}
          </Link>
        </div>
      </div>
    </SiteContainer>
  );
}
