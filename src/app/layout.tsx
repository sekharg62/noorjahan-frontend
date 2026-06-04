import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchDrawer } from "@/components/search-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { CartProvider } from "@/context/cart-context";
import { SearchProvider } from "@/context/search-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-neutral-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-neutral-900 focus:text-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <WishlistProvider>
          <SearchProvider>
            <CartProvider>
              <AnnouncementBar />
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <SearchDrawer />
              <CartDrawer />
              <WhatsAppFloat />
            </CartProvider>
          </SearchProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
