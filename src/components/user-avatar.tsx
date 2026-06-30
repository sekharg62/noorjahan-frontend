function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type UserAvatarSize = "sm" | "md";

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: "w-4 h-4 text-[8px]",
  md: "w-5 h-5 text-[9px]",
};

interface UserAvatarProps {
  name: string;
  size?: UserAvatarSize;
  className?: string;
}

export function UserAvatar({ name, size = "md", className = "" }: UserAvatarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-neutral-900 text-white font-semibold uppercase shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
