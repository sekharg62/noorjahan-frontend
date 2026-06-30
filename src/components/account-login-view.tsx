"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SiteContainer } from "@/components/site-container";
import { AccountField } from "@/components/account-field";
import { useAuth } from "@/context/auth-context";
import { accountCopy } from "@/data/static-pages";
import {
  buildLoginPayload,
  customerAuthService,
  parseAuthResponse,
} from "@/service/customerAuthService";

const BANGLADESH_COUNTRY_CODE = "+880";
const BANGLADESH_PHONE_LOCAL_MAX_LENGTH = 11;

type View = "login" | "recover";

function syncViewFromHash(): View {
  if (typeof window === "undefined") return "login";
  return window.location.hash === "#recover" ? "recover" : "login";
}

function LoginPhoneField({ label }: { label: string }) {
  const [phoneLocal, setPhoneLocal] = useState("");

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replace(/\D/g, "")
      .slice(0, BANGLADESH_PHONE_LOCAL_MAX_LENGTH);
    setPhoneLocal(digits);
  };

  return (
    <div>
      <label
        htmlFor="login-phone"
        className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
      >
        {label}
      </label>
      <div className="flex border border-neutral-300 focus-within:border-neutral-900">
        <span
          className="shrink-0 px-4 py-3 text-sm text-neutral-600 bg-neutral-50 border-r border-neutral-300 select-none"
          aria-hidden
        >
          {BANGLADESH_COUNTRY_CODE}
        </span>
        <input
          id="login-phone"
          name="phoneLocal"
          type="tel"
          required
          value={phoneLocal}
          onChange={handlePhoneChange}
          autoComplete="tel-national"
          inputMode="numeric"
          maxLength={BANGLADESH_PHONE_LOCAL_MAX_LENGTH}
          placeholder="1XXXXXXXXX"
          className="min-w-0 flex-1 px-4 py-3 text-sm text-neutral-900 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function AccountLoginView() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [view, setView] = useState<View>("login");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/account/profile");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setView(syncViewFromHash());
    const onHashChange = () => setView(syncViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const showRecover = () => {
    window.location.hash = "recover";
    setView("recover");
    setMessage(null);
    setError(null);
  };

  const showLogin = () => {
    if (window.location.hash === "#recover") {
      history.replaceState(null, "", window.location.pathname);
    }
    setView("login");
    setMessage(null);
    setError(null);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const phoneLocal = String(data.get("phoneLocal") ?? "")
      .trim()
      .replace(/\D/g, "")
      .replace(/^0+/, "");

    const payload = buildLoginPayload({
      phoneLocal,
      password: String(data.get("password") ?? ""),
    });

    try {
      const response = await customerAuthService.login(payload);
      const session = parseAuthResponse(response);

      if (!session) {
        throw new Error("Invalid auth response");
      }

      login(session.token, session.customer);
      router.replace("/account/profile");
    } catch {
      setError(accountCopy.login.error);
      setSubmitting(false);
    }
  };

  const handleRecover = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(accountCopy.recover.success);
    e.currentTarget.reset();
  };

  const copy = view === "recover" ? accountCopy.recover : accountCopy.login;

  return (
    <SiteContainer className="py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-xl sm:text-2xl uppercase tracking-[0.2em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-neutral-600">
          {copy.subtitle}
        </p>

        {view === "recover" ? (
          <form onSubmit={handleRecover} className="mt-8 space-y-5">
            <AccountField
              id="recover-email"
              name="email"
              label={accountCopy.recover.emailLabel}
              type="email"
              autoComplete="email"
            />
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors"
            >
              {accountCopy.recover.submit}
            </button>
            <button
              type="button"
              onClick={showLogin}
              className="w-full text-xs uppercase tracking-widest text-neutral-900 underline underline-offset-4 hover:opacity-70"
            >
              {accountCopy.recover.cancel}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <LoginPhoneField label={accountCopy.login.phoneLabel} />
            <AccountField
              id="login-password"
              name="password"
              label={accountCopy.login.passwordLabel}
              type="password"
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors disabled:opacity-60"
            >
              {submitting ? accountCopy.login.submitLoading : accountCopy.login.submit}
            </button>
            <p className="text-center text-sm text-neutral-600">
              {accountCopy.login.noAccount}{" "}
              <Link
                href="/account/register"
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
              >
                {accountCopy.login.createAccount}
              </Link>
            </p>
            <p className="text-center">
              <button
                type="button"
                onClick={showRecover}
                className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
              >
                {accountCopy.login.forgotPassword}
              </button>
            </p>
          </form>
        )}

        {message && (
          <p
            className="mt-6 text-center text-sm leading-relaxed text-neutral-600"
            role="status"
          >
            {message}
          </p>
        )}
      </div>
    </SiteContainer>
  );
}
