export function getApiUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL?.trim() ||
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      ""
    );
  }

  return process.env.NEXT_PUBLIC_API_URL?.trim() || "";
}
