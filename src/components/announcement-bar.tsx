import type { CSSProperties } from "react";
import Link from "next/link";
import {
  siteConfig,
  getWhatsAppUrl,
  formatAnnouncementText,
  formatFreeShippingThreshold,
} from "@/lib/site-config";

function AnnouncementContent() {
  const announcementText = siteConfig.announcement.text?.trim();

  return (
    <span className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap">
      {announcementText ? (
        formatAnnouncementText(announcementText)
      ) : (
        <>Free Shipping Over {formatFreeShippingThreshold()}. For Queries:</>
      )}
      {siteConfig.announcement.showPhone && siteConfig.contact.phone && (
        <span>{siteConfig.contact.phone}</span>
      )}
      {siteConfig.announcement.showWhatsApp && siteConfig.contact.whatsapp && (
        <>
          <span className="hidden sm:inline">·</span>
          <span>
            WhatsApp:{" "}
            <Link
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-300 transition-colors"
            >
              {siteConfig.contact.whatsapp}
            </Link>
          </span>
        </>
      )}
    </span>
  );
}

export function AnnouncementBar() {
  if (!siteConfig.announcement.enabled) return null;

  const speed =
    "scrollSpeedSeconds" in siteConfig.announcement &&
    siteConfig.announcement.scrollSpeedSeconds
      ? `${siteConfig.announcement.scrollSpeedSeconds}s`
      : "32s";

  return (
    <div
      className="bg-neutral-900 text-white text-xs sm:text-sm py-2 overflow-hidden"
      role="region"
      aria-label="Store announcement"
      style={
        {
          "--announcement-duration": speed,
        } as CSSProperties
      }
    >
      <div className="announcement-marquee flex w-max">
        {[0, 1].map((track) => (
          <div
            key={track}
            className="announcement-marquee-track flex items-center"
            aria-hidden={track === 1 ? true : undefined}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={`${track}-${i}`}
                className="inline-flex shrink-0 px-10 sm:px-16"
              >
                <AnnouncementContent />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
