import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { FaqAccordion } from "@/components/faq-accordion";
import { SiteContainer } from "@/components/site-container";
import type { ContentSection, QaItem, StaticPage } from "@/data/static-pages";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

function PageTitle({ children }: { children: string }) {
  return (
    <h1 className="text-center text-2xl sm:text-3xl uppercase tracking-[0.2em] font-bold text-neutral-900">
      {children}
    </h1>
  );
}

function SectionBlock({ section }: { section: ContentSection }) {
  return (
    <section>
      {section.heading ? (
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4">
          {section.heading}
        </h2>
      ) : null}
      {section.paragraphs?.map((p) => (
        <p key={p.slice(0, 24)} className="mt-4 first:mt-0 leading-[1.85]">
          {p}
        </p>
      ))}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-4 list-disc pl-5 space-y-2.5">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SectionsLayout({
  page,
  introCentered = false,
}: {
  page: StaticPage;
  introCentered?: boolean;
}) {
  return (
    <article className="mx-auto mt-10 lg:mt-14 max-w-2xl text-sm leading-[1.85] text-neutral-600">
      {page.intro && (
        <p
          className={`mb-8 leading-[1.85] ${introCentered ? "text-center" : "text-center sm:text-left"}`}
        >
          {page.intro}
        </p>
      )}
      <div className="space-y-10 lg:space-y-12">
        {page.sections?.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}

function QaBlock({ items }: { items: QaItem[] }) {
  return (
    <div className="space-y-10 lg:space-y-12">
      {items.map((item, index) => (
        <section key={item.id}>
          <h2 className="text-sm font-semibold text-neutral-900 leading-snug">
            {index + 1}. {item.question}
          </h2>
          <p className="mt-3 text-sm leading-[1.85] text-neutral-600">
            {item.answer}
          </p>
          {item.links && item.links.length > 0 && (
            <ul className="mt-3 space-y-2">
              {item.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-neutral-900 underline underline-offset-2 hover:opacity-70 break-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

function PrivacyContactFooter() {
  const { customerCareEmail, email, phone, whatsapp, uan } = siteConfig.contact;
  const careEmail = customerCareEmail ?? email;

  return (
    <div className="mt-10 lg:mt-12 pt-8 border-t border-neutral-200 text-sm leading-relaxed text-neutral-600 space-y-3">
      <p>
        Questions about this Privacy Policy? Email{" "}
        <a
          href={`mailto:${careEmail}`}
          className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          {careEmail}
        </a>
        , call{" "}
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          {phone}
        </a>
        {uan ? (
          <>
            {" "}
            or UAN{" "}
            <strong className="font-bold text-neutral-900">{uan}</strong>
          </>
        ) : null}
        . WhatsApp:{" "}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          {whatsapp}
        </a>
        .
      </p>
      <p>
        See also{" "}
        <Link
          href="/pages/terms-and-conditions"
          className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          Terms and Conditions
        </Link>
        {" · "}
        <Link
          href="/pages/faqs"
          className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          FAQs
        </Link>
        {" · "}
        <Link
          href="/pages/contact-us"
          className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
        >
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}

export function StaticPageView({ page }: { page: StaticPage }) {
  const { customerCareEmail, email, headOffice, uan, whatsapp, phone } =
    siteConfig.contact;
  const careEmail = customerCareEmail ?? email;

  switch (page.layout) {
    case "centered":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          <div className="mx-auto mt-10 lg:mt-14 max-w-2xl text-center text-sm sm:text-[15px] leading-[1.85] text-neutral-600 space-y-6">
            {page.paragraphs?.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </SiteContainer>
      );

    case "stores":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          <h2 className="mt-10 lg:mt-12 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-neutral-900">
            Store locator
          </h2>
          <div className="mx-auto mt-10 lg:mt-12 max-w-2xl space-y-10 lg:space-y-12">
            {page.stores?.map((store) => (
              <section key={store.id}>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-neutral-900">
                  {store.name}
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600 list-none">
                  <li className="flex gap-2">
                    <span className="shrink-0" aria-hidden>
                      •
                    </span>
                    <span>{store.address}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0" aria-hidden>
                      •
                    </span>
                    <span>Phone: {store.phone}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0" aria-hidden>
                      •
                    </span>
                    <span>
                      Location:{" "}
                      <a
                        href={store.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
                      >
                        Click here.
                      </a>
                    </span>
                  </li>
                </ul>
              </section>
            ))}
          </div>
          {page.storesFooterNote && (
            <p className="mx-auto mt-12 lg:mt-16 max-w-2xl text-center text-xs text-neutral-500 leading-relaxed">
              {page.storesFooterNote}
            </p>
          )}
        </SiteContainer>
      );

    case "contact":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <header className="text-center max-w-2xl mx-auto">
            <h1 className="text-xl sm:text-2xl uppercase tracking-[0.2em] font-bold text-neutral-900">
              {page.title}
            </h1>
            {page.contactIntro && (
              <p className="mt-6 text-sm leading-relaxed text-neutral-600">
                {page.contactIntro}
              </p>
            )}
          </header>
          <div className="mx-auto mt-10 lg:mt-14 max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">
            <div className="lg:pr-4">
              <ContactForm />
            </div>
            <aside className="text-sm leading-relaxed text-neutral-600 space-y-4 lg:pt-1 lg:border-l lg:border-neutral-200 lg:pl-10">
              {headOffice ? (
                <p>
                  <strong className="font-bold text-neutral-900">
                    Head Office:
                  </strong>{" "}
                  {headOffice}
                </p>
              ) : null}
              <p>
                <strong className="font-bold text-neutral-900">
                  Call/WhatsApp:
                </strong>{" "}
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="underline underline-offset-2 hover:opacity-70"
                >
                  {phone}
                </a>
                {" · "}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-70"
                >
                  {whatsapp}
                </a>
              </p>
              {uan ? (
                <p>
                  <strong className="font-bold text-neutral-900">UAN:</strong>{" "}
                  {uan}
                </p>
              ) : null}
              <p>
                <strong className="font-bold text-neutral-900">Email:</strong>{" "}
                <a
                  href={`mailto:${careEmail}`}
                  className="underline underline-offset-2 hover:opacity-70"
                >
                  {careEmail}
                </a>
              </p>
            </aside>
          </div>
        </SiteContainer>
      );

    case "faq":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          {page.intro && (
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-neutral-600">
              {page.intro}
            </p>
          )}
          <div className="mx-auto mt-10 lg:mt-12 max-w-2xl">
            {page.faqs && <FaqAccordion items={page.faqs} />}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600">
            Still have questions?{" "}
            <Link
              href="/pages/contact-us"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
            >
              Contact us
            </Link>
            .
          </p>
        </SiteContainer>
      );

    case "terms":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          <article className="mx-auto mt-10 lg:mt-14 max-w-2xl text-sm leading-[1.85] text-neutral-600">
            <section>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4">
                Information collection
              </h2>
              <p>{siteConfig.brandName} may use your personal data for the following purposes:</p>
              <ul className="mt-4 list-disc pl-5 space-y-2.5">
                {page.termsDataUses?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {page.termsSections
                ?.filter((s) => s.id === "retention")
                .flatMap((section) => section.paragraphs ?? [])
                .map((p) => (
                  <p key={p.slice(0, 24)} className="mt-4 leading-[1.85]">
                    {p}
                  </p>
                ))}
            </section>
            <div className="mt-10 lg:mt-12">
              {page.termsSections
                ?.filter((s) => s.id === "rights")
                .map((section) => (
                  <section key={section.id}>
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4">
                      {section.heading}
                    </h2>
                    {section.paragraphs?.map((p) => (
                      <p key={p.slice(0, 24)} className="leading-[1.85]">
                        {p}
                      </p>
                    ))}
                    <p className="mt-4">
                      If you require further information about our Privacy
                      Policy, please go to the{" "}
                      <Link
                        href="/pages/privacy-policy"
                        className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
                      >
                        Privacy Policy
                      </Link>{" "}
                      page or the help section of the website where FAQs are
                      answered. If you require more information please send an
                      email to{" "}
                      <a
                        href={`mailto:${careEmail}`}
                        className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
                      >
                        {careEmail}
                      </a>
                      . If you wish to talk to a {siteConfig.shortName}{" "}
                      customer care representative please call:{" "}
                      <strong className="font-bold text-neutral-900">
                        {whatsapp}
                      </strong>
                      {uan ? (
                        <>
                          {" "}
                          &amp; UAN{" "}
                          <strong className="font-bold text-neutral-900">
                            {uan}
                          </strong>
                        </>
                      ) : null}
                      {phone && phone !== whatsapp ? (
                        <>
                          {" "}
                          or{" "}
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="font-bold text-neutral-900 underline underline-offset-2 hover:opacity-70"
                          >
                            {phone}
                          </a>
                        </>
                      ) : null}
                      .
                    </p>
                  </section>
                ))}
            </div>
          </article>
        </SiteContainer>
      );

    case "qa":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          <article className="mx-auto mt-10 lg:mt-14 max-w-2xl">
            {page.qaItems && <QaBlock items={page.qaItems} />}
          </article>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600">
            Need help with your order?{" "}
            <Link
              href="/pages/contact-us"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
            >
              Contact us
            </Link>
            {" · "}
            <Link
              href="/pages/track-order"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:opacity-70"
            >
              Track your order
            </Link>
            .
          </p>
        </SiteContainer>
      );

    case "privacy":
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          {page.lastUpdated && (
            <p className="mt-4 text-center text-xs uppercase tracking-widest text-neutral-500">
              Last updated: {page.lastUpdated}
            </p>
          )}
          <SectionsLayout page={page} introCentered />
          <div className="mx-auto max-w-2xl">
            <PrivacyContactFooter />
          </div>
        </SiteContainer>
      );

    case "sections":
    default:
      return (
        <SiteContainer className="py-12 lg:py-20">
          <PageTitle>{page.title}</PageTitle>
          <SectionsLayout page={page} />
        </SiteContainer>
      );
  }
}
