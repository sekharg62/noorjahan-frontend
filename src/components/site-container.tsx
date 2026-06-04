import type { ReactNode } from "react";

interface SiteContainerProps {
  children: ReactNode;
  className?: string;
}

/** Shared page width & horizontal padding — tighter side margins */
export function SiteContainer({ children, className = "" }: SiteContainerProps) {
  return (
    <div
      className={[
        "w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
