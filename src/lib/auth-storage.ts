import type { Customer } from "@/types";

const AUTH_TOKEN_KEY = "noorjahan-auth-token";
const CUSTOMER_STORAGE_KEY = "noorjahan-customer";
export const AUTH_SESSION_CLEARED_EVENT = "auth:session-cleared";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  set(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

export const customerStorage = {
  get(): Customer | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Customer;
    } catch {
      return null;
    }
  },

  set(customer: Customer): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  },

  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  },
};

export function clearAuthSession(): void {
  tokenStorage.remove();
  customerStorage.remove();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_CLEARED_EVENT));
  }
}
