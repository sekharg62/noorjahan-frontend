import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wishlist",
  description: "Your saved products and favorites.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
