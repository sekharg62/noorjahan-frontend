import type { ReactNode } from "react";
import Link from "next/link";
import { footerLinks } from "@/data/data";
import { siteConfig } from "@/lib/site-config";
import { FooterSocial } from "@/components/footer-social";
import { SiteContainer } from "@/components/site-container";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-white mb-4 lg:mb-5">{children}</h3>
  );
}

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white mt-auto">
      <SiteContainer className="py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <FooterHeading>{group.title}</FooterHeading>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <FooterHeading>Socials</FooterHeading>
            <FooterSocial />
          </div>

          {siteConfig.newsletter.enabled && (
            <div>
              <FooterHeading>Newsletter</FooterHeading>
              <p className="text-sm font-semibold text-white mb-4 leading-snug">
                {siteConfig.newsletter.title}
              </p>
              <form className="flex flex-col sm:flex-row gap-2" action="#" method="post">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Email"
                  className="flex-1 min-w-0 border border-neutral-600 bg-neutral-900 text-white placeholder:text-neutral-500 px-3 py-2.5 text-sm focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500 space-y-1">
          <p className="text-neutral-400">{siteConfig.footer.copyright}</p>
          {siteConfig.footer.developer ? (
            <p>{siteConfig.footer.developer}</p>
          ) : null}
        </div>
      </SiteContainer>
    </footer>
  );
}
