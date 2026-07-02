"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Package, Truck } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { SiteContainer } from "@/components/site-container";
import { checkoutCopy } from "@/data/static-pages";
import { getCartLineId } from "@/lib/cart";
import { getOrderById, loadLastOrderFromSession } from "@/lib/orders";
import { formatPrice, siteConfig } from "@/lib/site-config";
import { getPaymentMethodLabel, isOnlinePaymentMethod } from "@/lib/payment";
import type { Order } from "@/types";

function formatOrderDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function SuccessLoading() {
  return (
    <SiteContainer className="py-20">
      <div className="mx-auto max-w-md text-center animate-pulse space-y-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-neutral-100" />
        <div className="h-6 bg-neutral-100 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-neutral-100 rounded w-full" />
      </div>
    </SiteContainer>
  );
}

function SuccessNotFound() {
  const copy = checkoutCopy.success;
  return (
    <SiteContainer className="py-16 lg:py-24">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-lg font-bold uppercase tracking-widest text-neutral-900">
          Order not found
        </h1>
        <p className="mt-4 text-sm text-neutral-600">{copy.notFound}</p>
        <Link
          href="/"
          className="inline-block mt-8 bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          {copy.continueShopping}
        </Link>
      </div>
    </SiteContainer>
  );
}

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const orderNo =
    searchParams.get("orderNo") ?? searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!orderNo) {
      setLoaded(true);
      return;
    }
    const fromStorage =
      getOrderById(orderNo) ?? loadLastOrderFromSession(orderNo);
    setOrder(fromStorage ?? null);
    setLoaded(true);
  }, [orderNo]);

  const copy = checkoutCopy.success;

  if (!loaded) return <SuccessLoading />;
  if (!orderNo || !order) return <SuccessNotFound />;

  const { address } = order;
  const steps = [
    {
      icon: Check,
      title: copy.step1,
      detail: copy.step1Detail,
      active: true,
    },
    {
      icon: Package,
      title: copy.step2,
      detail: copy.step2Detail,
      active: false,
    },
    {
      icon: Truck,
      title: copy.step3,
      detail: copy.step3Detail,
      active: false,
    },
  ];

  return (
    <SiteContainer className="py-10 lg:py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white"
          aria-hidden
        >
          <Check className="w-8 h-8" strokeWidth={2} />
        </div>
        <p className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-600 border border-neutral-300 px-3 py-1 mb-4">
          {copy.confirmed}
        </p>
        <h1 className="text-2xl sm:text-3xl uppercase tracking-[0.15em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
          {copy.subtitle}
        </p>
        <p className="mt-6 text-lg font-semibold text-neutral-900 tracking-wide">
          {copy.orderId}:{" "}
          <span className="font-mono">{orderNo}</span>
        </p>
        <p className="mt-3 text-sm text-neutral-600 max-w-md mx-auto">
          {copy.trackHint}
        </p>
        <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest">
          {copy.orderDate}: {formatOrderDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Main: items + totals */}
        <div className="lg:col-span-2 border border-neutral-200">
          <div className="px-5 sm:px-6 py-4 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {copy.itemsOrdered}
            </h2>
          </div>
          <ul className="divide-y divide-neutral-200">
            {order.items.map((item) => (
              <li
                key={getCartLineId(
                  item.product.id,
                  item.sizeId ?? item.size,
                )}
                className="flex gap-4 p-5 sm:p-6"
              >
                <div className="relative w-20 h-24 shrink-0 bg-neutral-100">
                  <SiteImage
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-medium text-neutral-900">{item.product.name}</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                    Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-neutral-900 shrink-0 self-center">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="px-5 sm:px-6 py-5 border-t border-neutral-200 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>{copy.subtotal}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>{copy.shipping}</span>
              <span>
                {order.shipping === 0
                  ? copy.shippingFree
                  : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
              <span>{copy.total}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-neutral-200 p-5 sm:p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4">
              {copy.payment}
            </h2>
            <p className="text-sm font-semibold text-neutral-900">
              {getPaymentMethodLabel(order.paymentMethod)}
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              {isOnlinePaymentMethod(order.paymentMethod)
                ? copy.payOnline
                : copy.payOnDelivery}
            </p>
            <p className="mt-4 text-2xl font-bold text-neutral-900">
              {formatPrice(order.total)}
            </p>
          </div>

          <div className="border border-neutral-200 p-5 sm:p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4">
              {copy.delivery}
            </h2>
            <address className="text-sm text-neutral-600 not-italic leading-relaxed">
              <span className="font-semibold text-neutral-900 block mb-1">
                {address.fullName}
              </span>
              {address.phone}
              {address.email ? (
                <>
                  <br />
                  {address.email}
                </>
              ) : null}
              <br />
              <span className="mt-2 block">
                {address.addressLine}
                <br />
                {address.city}
                {address.district ? `, ${address.district}` : ""}
                {address.postalCode ? ` ${address.postalCode}` : ""}
                <br />
                Bangladesh
              </span>
            </address>
          </div>

          <div className="border border-neutral-200 p-5 sm:p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-5">
              {copy.whatsNext}
            </h2>
            <ol className="space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border ${
                      step.active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 text-neutral-400"
                    }`}
                  >
                    <step.icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        step.active ? "text-neutral-900" : "text-neutral-500"
                      }`}
                    >
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-neutral-600 max-w-xl mx-auto">
        {copy.help}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-block min-w-[200px] bg-neutral-900 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-center hover:bg-neutral-800 transition-colors"
        >
          {copy.continueShopping}
        </Link>
        <Link
          href={`/pages/track-order?orderNo=${encodeURIComponent(orderNo)}`}
          className="inline-block min-w-[200px] border border-neutral-900 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-center hover:bg-neutral-50 transition-colors"
        >
          {copy.trackOrder}
        </Link>
        <Link
          href="/pages/contact-us"
          className="inline-block min-w-[200px] border border-neutral-300 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-center text-neutral-700 hover:border-neutral-900 transition-colors"
        >
          {copy.contactUs}
        </Link>
      </div>

      <p className="mt-10 text-center text-xs text-neutral-400">
        {siteConfig.brandName}
      </p>
    </SiteContainer>
  );
}
