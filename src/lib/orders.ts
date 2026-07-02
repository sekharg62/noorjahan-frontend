import type { CartItem, Order, ShippingAddress } from "@/types";

const ORDERS_STORAGE_KEY = "noorjahan-orders";
export const LAST_ORDER_SESSION_KEY = "noorjahan-last-order";

export function persistLastOrderForConfirmation(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadLastOrderFromSession(orderId: string): Order | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_SESSION_KEY);
    if (!raw) return undefined;
    const order = JSON.parse(raw) as Order;
    return order.id === orderId ? order : undefined;
  } catch {
    return undefined;
  }
}

export function generateOrderId(): string {
  const suffix = Date.now().toString(36).toUpperCase().slice(-8);
  return `NJ-${suffix}`;
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrders();
    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...existing]),
    );
  } catch {
    /* ignore */
  }
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function createOrderFromCart(params: {
  items: CartItem[];
  address: ShippingAddress;
  subtotal: number;
  shipping: number;
}): Order {
  const { items, address, subtotal, shipping } = params;
  return {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    items,
    address,
    paymentMethod: "COD",
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "placed",
  };
}
