import type { ComponentType, SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/social-icons";
import { siteConfig } from "@/lib/site-config";

const socialPlatforms: {
  key: keyof typeof siteConfig.social;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "pinterest", label: "Pinterest", Icon: PinterestIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
];

const iconClass = "w-[18px] h-[18px] shrink-0";

export function FooterSocial() {
  return (
    <ul className="space-y-3">
      {socialPlatforms.map(({ key, label, Icon }) => {
        const href = siteConfig.social[key]?.trim();

        const content = (
          <>
            <Icon className={iconClass} />
            <span className="text-sm font-medium">{label}</span>
          </>
        );

        if (!href) {
          return (
            <li key={key}>
              <span
                className="inline-flex items-center gap-3 text-white/40 cursor-not-allowed"
                title={`Add ${label} URL in siteConfig.json`}
              >
                {content}
              </span>
            </li>
          );
        }

        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white hover:text-white/80 transition-colors"
            >
              {content}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
