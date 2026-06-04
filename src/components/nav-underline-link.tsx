import type { ReactNode } from "react";
import Link from "next/link";

interface NavUnderlineLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  variant?: "main" | "dropdown";
  className?: string;
  onClick?: () => void;
}

export function NavUnderlineLink({
  href,
  children,
  active = false,
  variant = "main",
  className = "",
  onClick,
}: NavUnderlineLinkProps) {
  const isMain = variant === "main";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group/nav relative inline-block transition-colors duration-200",
        isMain
          ? "text-[11px] xl:text-xs font-semibold uppercase tracking-wide xl:tracking-widest text-neutral-800 hover:text-neutral-900 py-6 block"
          : "block px-5 py-2.5 text-sm font-normal text-neutral-600 hover:text-neutral-900 w-full",
        active ? "text-neutral-900" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative z-[1]">{children}</span>
      <span
        aria-hidden
        className={[
          "absolute left-0 right-0 h-px bg-neutral-900",
          "transform scale-x-0 origin-center",
          "transition-transform duration-300 ease-out",
          "group-hover/nav:scale-x-100",
          active ? "scale-x-100" : "",
          isMain ? "bottom-4" : "bottom-2",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </Link>
  );
}
