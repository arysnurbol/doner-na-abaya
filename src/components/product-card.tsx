"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/menu";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { useStore } from "./store";

/** Выбор размера + кнопка «В корзину». Общий для карточек меню и витрины. */
export function AddControls({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const { t, lang, add } = useStore();
  // Донер по умолчанию M (сытнее), напитки — бутылка (первый вариант)
  const [variantId, setVariantId] = useState((product.isDoner ? product.variants.at(-1)! : product.variants[0]).id);
  const [justAdded, setJustAdded] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  useEffect(() => {
    if (!justAdded) return;
    const id = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(id);
  }, [justAdded]);

  return (
    <div className="@container flex flex-col gap-3">
      {product.variants.length > 1 && (
        <div role="radiogroup" aria-label={t.menu.size} className="flex gap-1.5 rounded-full bg-char/6 p-1">
          {product.variants.map((v) => (
            <button
              key={v.id}
              role="radio"
              aria-checked={v.id === variantId}
              onClick={() => {
                setVariantId(v.id);
                track("product_click", { item_id: `${product.id}:${v.id}` });
              }}
              className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm transition-colors @max-[15rem]:px-1 @max-[15rem]:text-[13px] ${
                v.id === variantId ? "bg-white font-bold text-char shadow-sm" : "text-char/65 hover:text-char"
              }`}
            >
              <span className={product.isDoner ? "font-display" : ""}>{v.label[lang]}</span>
              <span className="text-xs @max-[15rem]:hidden">{v.amount[lang]}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className={`tnum font-display font-extrabold ${size === "lg" ? "text-2xl" : "text-lg sm:text-xl"}`}>
          {formatPrice(variant.price)}
        </span>
        <button
          onClick={() => {
            add(product.id, variant.id);
            setJustAdded(true);
          }}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 @max-[15rem]:w-full font-bold transition-[background-color,transform] active:scale-95 ${
            justAdded ? "bg-emerald-600 text-white" : "bg-char text-white hover:bg-sauce"
          }`}
        >
          {justAdded ? <Check className="size-4.5" strokeWidth={3} /> : <Plus className="size-4.5" strokeWidth={3} />}
          {justAdded ? t.menu.added : t.menu.add}
        </button>
      </div>
    </div>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang } = useStore();
  const single = product.variants.length === 1 ? product.variants[0].amount[lang] : null;
  return (
    <article className="group flex flex-col overflow-hidden rounded-[28px] bg-studio">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name[lang]}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
          placeholder="blur"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-3 pt-1 pb-3 sm:px-5 sm:pb-5">
        <div className="flex-1">
          <h3 className="font-display text-[15px] leading-tight font-extrabold sm:text-[17px]">
            {product.name[lang]}
            {single && <span className="ml-1.5 font-sans text-xs font-medium whitespace-nowrap text-muted sm:text-sm">{single}</span>}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted sm:line-clamp-3 sm:text-sm">{product.description[lang]}</p>
        </div>
        <AddControls product={product} />
      </div>
    </article>
  );
}
