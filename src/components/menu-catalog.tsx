"use client";

import { useEffect, useRef, useState } from "react";
import { categories, products, type CategoryId } from "@/data/menu";
import { track } from "@/lib/analytics";
import { ProductCard } from "./product-card";
import { useStore } from "./store";

export function MenuCatalog() {
  const { t, lang } = useStore();
  const [active, setActive] = useState<CategoryId | "all">("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("menu_view");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tabs = [{ id: "all" as const, label: t.menu.all }, ...categories.map((c) => ({ id: c.id, label: c.label[lang] }))];
  const list = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div ref={ref}>
      <div
        role="tablist"
        aria-label={t.menu.title}
        className="sticky top-[60px] z-20 -mx-4 flex gap-2 overflow-x-auto bg-white/95 px-4 py-3 backdrop-blur [scrollbar-width:none] sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls="menu-grid"
            onClick={() => setActive(tab.id)}
            className={`min-h-11 shrink-0 rounded-full px-5 font-bold transition-colors ${
              active === tab.id ? "bg-char text-saffron" : "bg-studio text-char hover:bg-line"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id="menu-grid" role="tabpanel" className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">{t.menu.priceNote}</p>
    </div>
  );
}
