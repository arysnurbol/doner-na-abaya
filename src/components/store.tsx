"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/config/site";
import { productById } from "@/data/menu";
import { kz } from "@/i18n/kz";
import { ru, type Dict } from "@/i18n/ru";
import { track } from "@/lib/analytics";
import { MAX_QTY, resolveLines, type CartLine, type ResolvedLine } from "@/lib/order";

const STORAGE_KEY = "dna-cart-v1";
const dicts: Record<Lang, Dict> = { ru, kz };

type Toast = { id: number; productId: string; variantId: string } | null;

type Store = {
  lang: Lang;
  t: Dict;
  lines: ResolvedLine[];
  count: number;
  total: number;
  add: (productId: string, variantId: string, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: Toast;
  dismissToast: () => void;
};

const Ctx = createContext<Store | null>(null);

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}

function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l?.productId === "string" && typeof l?.variantId === "string" && Number.isFinite(l?.qty),
    );
  } catch {
    return [];
  }
}

export function StoreProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    // Корзина живёт в localStorage, читаем её после монтирования, чтобы не было расхождения с SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRaw(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* приватный режим — корзина живёт до перезагрузки */
    }
  }, [raw, hydrated]);

  const lines = useMemo(() => resolveLines(raw), [raw]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.sum, 0);

  const add = useCallback<Store["add"]>((productId, variantId, qty = 1, opts) => {
    const p = productById.get(productId);
    const v = p?.variants.find((x) => x.id === variantId);
    if (!p || !v) return;
    setRaw((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
      if (i === -1) return [...prev, { productId, variantId, qty }];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, MAX_QTY) };
      return next;
    });
    track("add_to_cart", { item_id: `${productId}:${variantId}`, item_name: p.name.ru, price: v.price, quantity: qty, currency: "KZT" });
    if (!opts?.silent) setToast({ id: Date.now(), productId, variantId });
  }, []);

  const setQty = useCallback<Store["setQty"]>((productId, variantId, qty) => {
    setRaw((prev) => {
      if (qty <= 0) {
        track("remove_from_cart", { item_id: `${productId}:${variantId}` });
        return prev.filter((l) => !(l.productId === productId && l.variantId === variantId));
      }
      return prev.map((l) =>
        l.productId === productId && l.variantId === variantId ? { ...l, qty: Math.min(qty, MAX_QTY) } : l,
      );
    });
  }, []);

  const value: Store = {
    lang,
    t: dicts[lang],
    lines,
    count,
    total,
    add,
    setQty,
    clear: useCallback(() => setRaw([]), []),
    cartOpen,
    openCart: useCallback(() => {
      setToast(null);
      setCartOpen(true);
    }, []),
    closeCart: useCallback(() => setCartOpen(false), []),
    toast,
    dismissToast: useCallback(() => setToast(null), []),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
