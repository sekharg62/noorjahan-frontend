import { AccountAddressesView } from "@/components/account-addresses-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Manage Addresses",
  description: "Manage your saved delivery addresses.",
  path: "/account/addresses",
  noIndex: true,
});

export default function AccountAddressesPage() {
  return <AccountAddressesView />;
}
