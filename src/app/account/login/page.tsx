import { AccountLoginView } from "@/components/account-login-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in to your NOORJAHAN account.",
  path: "/account/login",
  noIndex: true,
});

export default function AccountLoginPage() {
  return <AccountLoginView />;
}
