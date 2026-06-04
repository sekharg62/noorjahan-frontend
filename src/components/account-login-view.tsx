"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { SiteContainer } from "@/components/site-container";
import { AccountField } from "@/components/account-field";
import { accountCopy } from "@/data/static-pages";

type View = "login" | "recover";

function syncViewFromHash(): View {
  if (typeof window === "undefined") return "login";
  return window.location.hash === "#recover" ? "recover" : "login";
}

export function AccountLoginView() {
  const [view, setView] = useState<View>("login");
  const [message, setMessage] = useState<string | null>(null);

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
  };

  const showLogin = () => {
    if (window.location.hash === "#recover") {
      history.replaceState(null, "", window.location.pathname);
    }
    setView("login");
    setMessage(null);
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(accountCopy.formNotice);
    e.currentTarget.reset();
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
            <AccountField
              id="login-email"
              name="email"
              label={accountCopy.login.emailLabel}
              type="email"
              autoComplete="email"
            />
            <AccountField
              id="login-password"
              name="password"
              label={accountCopy.login.passwordLabel}
              type="password"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors"
            >
              {accountCopy.login.submit}
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
