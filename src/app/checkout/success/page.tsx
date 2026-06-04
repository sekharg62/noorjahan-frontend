import { Suspense } from "react";
import { CheckoutSuccessView } from "@/components/checkout-success-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Order Confirmation",
  description: "Your order has been placed successfully.",
  path: "/checkout/success",
  noIndex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-neutral-500 uppercase tracking-widest">
          Loading order…
        </div>
      }
    >
      <CheckoutSuccessView />
    </Suspense>
  );
}
