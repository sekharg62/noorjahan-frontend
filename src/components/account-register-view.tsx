"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SiteContainer } from "@/components/site-container";
import { AccountField } from "@/components/account-field";
import { accountCopy } from "@/data/static-pages";

export function AccountRegisterView() {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(accountCopy.formNotice);
    e.currentTarget.reset();
  };

  const copy = accountCopy.register;

  return (
    <SiteContainer className="py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-xl sm:text-2xl uppercase tracking-[0.2em] font-bold text-neutral-900">
          {copy.title}
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-neutral-600">
          {copy.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <AccountField
              id="register-first-name"
              name="firstName"
              label={copy.firstNameLabel}
              autoComplete="given-name"
            />
            <AccountField
              id="register-last-name"
              name="lastName"
              label={copy.lastNameLabel}
              autoComplete="family-name"
            />
          </div>
          <AccountField
            id="register-email"
            name="email"
            label={copy.emailLabel}
            type="email"
            autoComplete="email"
          />
          <AccountField
            id="register-password"
            name="password"
            label={copy.passwordLabel}
            type="password"
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors"
          >
            {copy.submit}
          </button>
          <p className="text-center text-sm text-neutral-600">
            {copy.hasAccount}{" "}
            <Link
              href="/account/login"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
            >
              {copy.login}
            </Link>
          </p>
        </form>

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
