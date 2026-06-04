import { AccountRegisterView } from "@/components/account-register-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create Account",
  description: "Create your NOORJAHAN account.",
  path: "/account/register",
  noIndex: true,
});

export default function AccountRegisterPage() {
  return <AccountRegisterView />;
}
