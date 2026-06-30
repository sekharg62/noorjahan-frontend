"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { SiteContainer } from "@/components/site-container";
import { AccountField } from "@/components/account-field";
import { accountCopy } from "@/data/static-pages";
import {
  buildRegisterPayload,
  customerAuthService,
  parseAuthResponse,
} from "@/service/customerAuthService";
import { useAuth } from "@/context/auth-context";

const BANGLADESH_COUNTRY_CODE = "+880";
const BANGLADESH_PHONE_LOCAL_MAX_LENGTH = 11;

function RegisterPhoneField({ label }: { label: string }) {
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
        htmlFor="register-phone"
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
          id="register-phone"
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

export function AccountRegisterView() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const copy = accountCopy.register;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/account/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const phoneLocal = String(data.get("phoneLocal") ?? "")
      .trim()
      .replace(/\D/g, "")
      .replace(/^0+/, "");

    const email = String(data.get("email") ?? "").trim();

    const payload = buildRegisterPayload({
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      phoneLocal,
      email: email || undefined,
      password: String(data.get("password") ?? ""),
    });

    try {
      const response = await customerAuthService.register(payload);
      const session = parseAuthResponse(response);

      if (!session) {
        throw new Error("Invalid auth response");
      }

      login(session.token, session.customer);
      router.replace("/account/profile");
    } catch {
      setError(copy.error);
      setSubmitting(false);
    }
  };

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
          <RegisterPhoneField label={copy.phoneLabel} />
          <AccountField
            id="register-email"
            name="email"
            label={copy.emailLabel}
            type="email"
            required={false}
            autoComplete="email"
          />
          <AccountField
            id="register-password"
            name="password"
            label={copy.passwordLabel}
            type="password"
            autoComplete="new-password"
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
            {submitting ? copy.submitLoading : copy.submit}
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
      </div>
    </SiteContainer>
  );
}
