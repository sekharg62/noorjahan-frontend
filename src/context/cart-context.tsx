"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCartLineId } from "@/lib/cart";
import type { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "noorjahan-cart";

function normalizeStoredItems(raw: CartItem[]): CartItem[] {
  return raw
    .filter((item) => item.product?.id && item.size)
    .map((item) => ({
      ...item,
      size: item.size,
      product: {
        ...item.product,
        sizes:
          item.product.sizes?.length > 0
            ? item.product.sizes
            : ["S", "M", "L"],
      },
    }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(normalizeStoredItems(JSON.parse(stored) as CartItem[]));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, size: string, quantity = 1) => {
      if (product.soldOut) return;
      if (!product.sizes.includes(size)) return;

      const lineId = getCartLineId(product.id, size);

      setItems((prev) => {
        const existing = prev.find(
          (i) => getCartLineId(i.product.id, i.size) === lineId,
        );
        if (existing) {
          return prev.map((i) =>
            getCartLineId(i.product.id, i.size) === lineId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { product, quantity, size }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    const lineId = getCartLineId(productId, size);
    setItems((prev) =>
      prev.filter((i) => getCartLineId(i.product.id, i.size) !== lineId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      const lineId = getCartLineId(productId, size);
      if (quantity < 1) {
        setItems((prev) =>
          prev.filter((i) => getCartLineId(i.product.id, i.size) !== lineId),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          getCartLineId(i.product.id, i.size) === lineId
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
