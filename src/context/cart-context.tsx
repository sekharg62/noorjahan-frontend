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
import {
  findProductSize,
  normalizeStoredProductSizes,
} from "@/lib/product-sizes";
import type { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, sizeId: string) => void;
  updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "noorjahan-cart";

function normalizeStoredItems(raw: CartItem[]): CartItem[] {
  return raw
    .map((item) => {
      if (!item.product?.id || !item.size) return null;

      const sizes = normalizeStoredProductSizes(item.product.sizes);
      const totalStock = sizes.reduce((sum, size) => sum + size.stock, 0);
      const sizeOption = findProductSize(
        { ...item.product, sizes, totalStock },
        item.size,
      );
      const sizeId = item.sizeId || sizeOption?.sizeId || "";

      if (!sizeId) return null;

      return {
        ...item,
        size: sizeOption?.label ?? item.size,
        sizeId,
        product: {
          ...item.product,
          sizes,
          totalStock,
        },
      };
    })
    .filter((item): item is CartItem => item !== null);
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

      const sizeOption = findProductSize(product, size);
      if (!sizeOption || sizeOption.stock <= 0) return;

      const lineId = getCartLineId(product.id, sizeOption.sizeId);

      setItems((prev) => {
        const existing = prev.find(
          (i) => getCartLineId(i.product.id, i.sizeId) === lineId,
        );
        const nextQuantity = (existing?.quantity ?? 0) + quantity;
        const cappedQuantity = Math.min(nextQuantity, sizeOption.stock);

        if (existing) {
          return prev.map((i) =>
            getCartLineId(i.product.id, i.sizeId) === lineId
              ? { ...i, quantity: cappedQuantity }
              : i,
          );
        }
        return [
          ...prev,
          {
            product,
            quantity: Math.min(quantity, sizeOption.stock),
            size: sizeOption.label,
            sizeId: sizeOption.sizeId,
          },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((productId: string, sizeId: string) => {
    const lineId = getCartLineId(productId, sizeId);
    setItems((prev) =>
      prev.filter((i) => getCartLineId(i.product.id, i.sizeId) !== lineId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, sizeId: string, quantity: number) => {
      const lineId = getCartLineId(productId, sizeId);
      if (quantity < 1) {
        setItems((prev) =>
          prev.filter((i) => getCartLineId(i.product.id, i.sizeId) !== lineId),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) => {
          if (getCartLineId(i.product.id, i.sizeId) !== lineId) return i;

          const sizeOption = findProductSize(i.product, i.size);
          const maxStock = sizeOption?.stock ?? quantity;
          return { ...i, quantity: Math.min(quantity, maxStock) };
        }),
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
