"use client";

import { Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { productById } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { useStore } from "./store";

/** Уведомление после добавления + предложение фри к донеру. */
export function CartToast() {
  const { t, lang, toast, dismissToast, add, lines, openCart } = useStore();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(dismissToast, 5000);
    return () => clearTimeout(id);
  }, [toast, dismissToast]);

  if (!toast) return null;
  const p = productById.get(toast.productId);
  if (!p) return null;
  const fries = productById.get("fries")!;
  const suggest = p.isDoner && !lines.some((l) => l.productId === "fries");

  return (
    <div
      key={toast.id}
      role="status"
      className="toast-in fixed inset-x-3 bottom-22 z-40 mx-auto max-w-md rounded-3xl bg-char p-3 pl-4 text-white shadow-2xl sm:bottom-6"
    >
      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm">
          <b>{p.name[lang]}</b> {t.cart.toastAdded}
        </p>
        <button onClick={openCart} className="min-h-10 rounded-full bg-white/10 px-3 text-sm font-bold">
          {t.cart.viewCart}
        </button>
        <button onClick={dismissToast} aria-label={t.cart.close} className="grid size-10 place-items-center rounded-full text-white/70">
          <X className="size-4" />
        </button>
      </div>
      {suggest && (
        <div className="mt-2 flex items-center gap-2 border-t border-white/15 pt-2">
          <p className="flex-1 text-sm text-white/80">
            {t.cart.toastSuggest} <span className="tnum">+{formatPrice(fries.variants[0].price)}</span>
          </p>
          <button
            onClick={() => {
              add("fries", "one", 1, { silent: true });
              dismissToast();
            }}
            className="inline-flex min-h-10 items-center gap-1 rounded-full bg-saffron px-4 text-sm font-bold text-char"
          >
            <Plus className="size-4" strokeWidth={3} />
            {t.cart.toastYes}
          </button>
        </div>
      )}
    </div>
  );
}

/** Нижняя панель на телефоне: появляется после hero. */
export function MobileBar() {
  const { t, count, total, openCart } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible || count > 0;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 sm:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {count > 0 ? (
        <button onClick={openCart} className="flex min-h-14 w-full items-center gap-3 rounded-full bg-char pr-2 pl-5 text-white shadow-2xl">
          <ShoppingBag className="size-5 text-saffron" />
          <span className="tnum text-sm text-white/80">{t.cart.items(count)}</span>
          <span className="tnum ml-auto font-display font-extrabold">{formatPrice(total)}</span>
          <span className="rounded-full bg-saffron px-4 py-2.5 text-sm font-bold text-char">{t.mobileBar.checkout}</span>
        </button>
      ) : (
        <a href="#menu" className="flex min-h-14 w-full items-center justify-center rounded-full bg-char font-bold text-white shadow-2xl">
          {t.mobileBar.menu}
        </a>
      )}
    </div>
  );
}

/** «Заказать»: если в корзине что-то есть — открывает её, иначе ведёт в меню. */
export function OrderButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { count, openCart } = useStore();
  return (
    <a
      href="#menu"
      onClick={(e) => {
        if (count > 0) {
          e.preventDefault();
          openCart();
        }
      }}
      className={className}
    >
      {children}
    </a>
  );
}

/** Добавляет набор позиций одним кликом. */
export function AddSetButton({
  items,
  className,
  children,
}: {
  items: readonly { productId: string; variantId: string }[];
  className?: string;
  children: React.ReactNode;
}) {
  const { add, openCart } = useStore();
  return (
    <button
      onClick={() => {
        items.forEach((i) => add(i.productId, i.variantId, 1, { silent: true }));
        openCart();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
