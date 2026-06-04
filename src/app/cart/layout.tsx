import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cart",
  description: "Review your shopping cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
