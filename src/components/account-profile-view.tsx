"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronRight, Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { SiteContainer } from "@/components/site-container";
import { useAuth } from "@/context/auth-context";
import { useCustomer } from "@/context/customer-context";
import { accountCopy } from "@/data/static-pages";
import { formatPrice } from "@/lib/site-config";

export function AccountProfileView() {
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();
  const {
    customer,
    orders,
    ordersTotal,
    addresses,
    profileLoading,
  } = useCustomer();
  const copy = accountCopy.profile;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || profileLoading) {
    return (
      <SiteContainer className="py-16 text-center text-sm text-neutral-500">
        {copy.loading}
      </SiteContainer>
    );
  }

  if (!customer) return null;

  const quickLinks = [
    { href: "/wishlist", label: copy.wishlist, icon: Heart },
    { href: "/pages/track-order", label: copy.trackOrder, icon: Package },
    { href: "/", label: copy.shop, icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/account/login");
  };

  return (
    <SiteContainer className="py-12 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-xl sm:text-2xl uppercase tracking-[0.2em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-center text-sm text-neutral-600">
          {copy.welcome}, <span className="font-semibold text-neutral-900">{customer.name}</span>
        </p>

        <section className="mt-10 border border-neutral-200 p-6 sm:p-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 mb-6">
            {copy.details}
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-neutral-100 pb-4">
              <dt className="text-neutral-500">{copy.name}</dt>
              <dd className="font-medium text-neutral-900 text-right">{customer.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-100 pb-4">
              <dt className="text-neutral-500">{copy.phone}</dt>
              <dd className="font-medium text-neutral-900 text-right">{customer.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">{copy.email}</dt>
              <dd className="font-medium text-neutral-900 text-right">
                {customer.email || copy.notProvided}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-8 border border-neutral-200 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {copy.orders}
            </h2>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              {ordersTotal}
            </span>
          </div>
          {orders.length > 0 ? (
            <ul className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-4 border border-neutral-100 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{order.orderNo}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                      {order.status}
                    </p>
                  </div>
                  <p className="font-medium text-neutral-900">
                    {formatPrice(Number(order.total))}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-600">{copy.noOrders}</p>
          )}
        </section>

        <section className="mt-8 border border-neutral-200 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {copy.addresses}
            </h2>
            <Link
              href="/account/addresses"
              className="text-xs uppercase tracking-widest text-neutral-900 underline underline-offset-2 hover:opacity-70"
            >
              {copy.manageAddresses}
            </Link>
          </div>
          {addresses.length > 0 ? (
            <ul className="space-y-3">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className="border border-neutral-100 px-4 py-3 text-sm text-neutral-700"
                >
                  <p className="font-medium text-neutral-900">{address.fullName}</p>
                  <p className="mt-1">
                    {address.address}, {address.city} {address.pincode}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-600">{copy.noAddresses}</p>
          )}
        </section>

        <section className="mt-8 border border-neutral-200">
          <h2 className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-200 bg-neutral-50">
            {copy.quickLinks}
          </h2>
          <ul>
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <li key={href} className="border-b border-neutral-100 last:border-0">
                <Link
                  href={href}
                  className="flex items-center justify-between px-6 py-4 text-sm text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 border border-neutral-900 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-neutral-900 hover:bg-neutral-50 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          {copy.logout}
        </button>
      </div>
    </SiteContainer>
  );
}
