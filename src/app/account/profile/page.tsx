import { AccountProfileView } from "@/components/account-profile-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "My Account",
  description: "View your NOORJAHAN account profile.",
  path: "/account/profile",
  noIndex: true,
});

export default function AccountProfilePage() {
  return <AccountProfileView />;
}
