"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const comment = String(data.get("comment") ?? "").trim();

    const subject = `Contact from ${name || "website visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      comment,
    ].join("\n");

    const mailTo =
      siteConfig.contact.customerCareEmail ?? siteConfig.contact.email;
    window.location.href = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          Phone number
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div>
        <label
          htmlFor="contact-comment"
          className="block text-xs uppercase tracking-widest text-neutral-900 mb-2"
        >
          Comment
        </label>
        <textarea
          id="contact-comment"
          name="comment"
          rows={5}
          required
          className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 resize-y min-h-[120px] focus:outline-none focus:border-neutral-900"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-neutral-800 transition-colors"
      >
        Send message
      </button>

      {submitted && (
        <p className="text-center text-xs text-neutral-600" role="status">
          Your email app should open with your message. If it does not, please
          email us directly.
        </p>
      )}
    </form>
  );
}
