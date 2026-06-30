interface SoldOutRibbonProps {
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizeConfig = {
  xs: {
    container: "h-14 w-14",
    ribbon: "top-3 -left-6 w-20 py-0.5 text-[8px] tracking-wider",
  },
  sm: {
    container: "h-24 w-24",
    ribbon: "top-5 -left-10 w-36 py-1 text-[10px] tracking-widest",
  },
  md: {
    container: "h-28 w-28",
    ribbon: "top-6 -left-11 w-44 py-1.5 text-xs tracking-widest",
  },
} as const;

export function SoldOutRibbon({ size = "sm", className = "" }: SoldOutRibbonProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`absolute top-0 left-0 z-10 overflow-hidden pointer-events-none ${config.container} ${className}`}
      aria-hidden
    >
      <span
        className={`absolute block bg-red-600 text-white font-semibold uppercase text-center shadow-sm -rotate-45 ${config.ribbon}`}
      >
        Sold out
      </span>
    </div>
  );
}
