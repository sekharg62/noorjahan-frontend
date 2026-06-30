"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { useMenuSubmenu } from "@/context/menu-submenu-context";
import { useSearchPanel } from "@/context/search-context";
import { useWishlist } from "@/context/wishlist-context";
import { NavUnderlineLink } from "@/components/nav-underline-link";
import { SiteContainer } from "@/components/site-container";
import { UserAvatar } from "@/components/user-avatar";
import type { NavItem } from "@/types";

function getDropdownItems(item: NavItem): NavItem[] {
  if (item.children && item.children.length > 0) return item.children;
  return [{ label: item.label, href: item.href }];
}

const DESKTOP_NAV_SKELETON_WIDTHS = ["w-14", "w-20", "w-16", "w-24", "w-[4.5rem]"];

function DesktopNavSkeleton() {
  return (
    <>
      {DESKTOP_NAV_SKELETON_WIDTHS.map((width, index) => (
        <div
          key={`nav-skeleton-${index}`}
          className="flex items-center py-6 shrink-0"
          aria-hidden
        >
          <span className={`h-2.5 ${width} rounded-sm bg-neutral-200 animate-pulse`} />
        </div>
      ))}
    </>
  );
}

function MobileNavSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={`mobile-nav-skeleton-${index}`}
          className="border-b border-neutral-100 py-3"
          aria-hidden
        >
          <span
            className={`block h-3.5 rounded-sm bg-neutral-200 animate-pulse ${
              index % 2 === 0 ? "w-32" : "w-24"
            }`}
          />
        </div>
      ))}
    </>
  );
}

export function Header() {
  const { navigation, loading: navLoading } = useMenuSubmenu();
  const { isAuthenticated, customer } = useAuth();
  const accountHref = isAuthenticated ? "/account/profile" : "/account/login";
  const accountLabel = isAuthenticated
    ? customer?.name ?? "Account"
    : "Login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { itemCount, openCart, closeCart, isOpen: cartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const {
    openSearch: openSearchPanel,
    closeSearch,
    isOpen: searchOpen,
  } = useSearchPanel();

  const openSearch = () => {
    if (cartOpen) closeCart();
    openSearchPanel();
  };

  const handleOpenCart = () => {
    if (searchOpen) closeSearch();
    openCart();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <SiteContainer>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 lg:gap-8 h-16 lg:h-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="min-w-0 text-neutral-900 hover:opacity-80 transition-opacity"
            >
              <span className="block font-serif text-base sm:text-lg lg:text-xl tracking-[0.12em] sm:tracking-[0.15em] uppercase truncate">
                {siteConfig.shortName}
              </span>
              {siteConfig.brandSubtitle && (
                <span className="hidden sm:block text-[10px] lg:text-xs tracking-[0.2em] uppercase text-neutral-500 mt-0.5 truncate">
                  {siteConfig.brandSubtitle}
                </span>
              )}
            </Link>
          </div>

          <nav
            className="hidden lg:flex items-stretch justify-center gap-3 xl:gap-5 min-w-0 px-2 xl:px-4"
            aria-busy={navLoading}
            aria-label={navLoading ? "Loading navigation" : undefined}
          >
            {navLoading ? (
              <DesktopNavSkeleton />
            ) : (
              navigation.map((item) => {
              const isOpen = activeMenu === item.href;
              const dropdownItems = getDropdownItems(item);

              return (
                <div
                  key={item.href}
                  className="relative shrink-0"
                  onMouseEnter={() => setActiveMenu(item.href)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <NavUnderlineLink href={item.href} active={isOpen}>
                    <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                  </NavUnderlineLink>

                  {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 pt-0">
                      <div className="min-w-[240px] bg-white border border-neutral-200 shadow-lg py-2">
                        {dropdownItems.map((child) => (
                          <NavUnderlineLink
                            key={child.href}
                            href={child.href}
                            variant="dropdown"
                          >
                            {child.label}
                          </NavUnderlineLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
            )}
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2 text-neutral-700 hover:text-red-500 transition-colors"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href={accountHref}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label={accountLabel}
              title={accountLabel}
            >
              {isAuthenticated && customer ? (
                <UserAvatar name={customer.name} />
              ) : (
                <User className="w-5 h-5" strokeWidth={1.5} />
              )}
            </Link>
            <button
              type="button"
              onClick={handleOpenCart}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </SiteContainer>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(320px,85vw)] bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-serif tracking-widest uppercase">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1" aria-busy={navLoading}>
              {navLoading ? (
                <MobileNavSkeleton />
              ) : (
                navigation.map((item) => {
                const isExpanded = mobileExpanded === item.href;
                const dropdownItems = getDropdownItems(item);

                return (
                  <div key={item.href} className="border-b border-neutral-100 last:border-0">
                    <div className="flex items-center">
                      <NavUnderlineLink
                        href={item.href}
                        variant="dropdown"
                        className="!flex-1 !px-0 !py-3 text-sm font-semibold uppercase tracking-widest"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </NavUnderlineLink>
                      <button
                        type="button"
                        className="p-3 text-neutral-600"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label} menu`}
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : item.href)
                        }
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {isExpanded &&
                      dropdownItems.map((child) => (
                        <NavUnderlineLink
                          key={child.href}
                          href={child.href}
                          variant="dropdown"
                          className="!px-4 !py-2 !text-sm"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </NavUnderlineLink>
                      ))}
                  </div>
                );
              })
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openSearch();
                }}
                className="flex items-center gap-2 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-900 w-full text-left"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
                Search
              </button>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-900"
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="text-xs text-red-500">({wishlistCount})</span>
                )}
              </Link>
              <NavUnderlineLink
                href={accountHref}
                variant="dropdown"
                className="!px-0 !py-3 text-sm uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                <span className="inline-flex items-center gap-2.5">
                  {isAuthenticated && customer ? (
                    <UserAvatar name={customer.name} size="sm" />
                  ) : (
                    <User className="w-4 h-4" strokeWidth={1.5} />
                  )}
                  {accountLabel}
                </span>
              </NavUnderlineLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
