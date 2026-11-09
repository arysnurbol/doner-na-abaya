import { site, type Lang } from "@/config/site";
import { productById, type Product, type Variant } from "@/data/menu";
import type { Dict } from "@/i18n/ru";
import { formatPrice } from "./format";

export type CartLine = { productId: string; variantId: string; qty: number };

export type ResolvedLine = CartLine & { product: Product; variant: Variant; sum: number };

export const MAX_QTY = 20;

/** Сопоставляет строки корзины с меню; неизвестные позиции отбрасываются. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = productById.get(l.productId);
    const variant = product?.variants.find((v) => v.id === l.variantId);
    if (!product || !variant) continue;
    const qty = Math.min(Math.max(1, Math.floor(l.qty)), MAX_QTY);
    out.push({ ...l, qty, product, variant, sum: variant.price * qty });
  }
  return out;
}

/** Убирает управляющие символы и лишние пробелы, ограничивает длину. */
export function clean(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F<>]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

/** Нормализует казахстанский номер к виду 7XXXXXXXXXX или возвращает null. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = "7" + d.slice(1);
  if (d.length === 10) d = "7" + d;
  return /^7[67]\d{9}$/.test(d) ? d : null;
}

export function formatPhone(d: string): string {
  return `+${d[0]} ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
}

export type CheckoutData = {
  name: string;
  phone: string;
  type: "pickup" | "delivery";
  address: string;
  comment: string;
};


export function buildWhatsAppMessage(
  lines: ResolvedLine[],
  data: CheckoutData,
  lang: Lang,
  t: Dict,
): string {
  const total = lines.reduce((s, l) => s + l.sum, 0);
  const rows = lines.map((l, i) => {
    const size = l.product.variants.length > 1 ? ` (${l.variant.label[lang]})` : "";
    return `${i + 1}. ${l.product.name[lang]}${size} — ${l.qty} ${t.cart.pcs} × ${formatPrice(l.variant.price)} = ${formatPrice(l.sum)}`;
  });
  const parts = [
    t.wa.hello,
    "",
    ...rows,
    "",
    `${t.wa.total}: ${formatPrice(total)}`,
    "",
    `${t.wa.name}: ${data.name}`,
    `${t.wa.phone}: ${formatPhone(data.phone)}`,
    `${t.wa.type}: ${data.type === "pickup" ? t.checkout.pickup : t.checkout.delivery}`,
  ];
  if (data.type === "delivery") parts.push(`${t.wa.address}: ${data.address}`);
  if (data.comment) parts.push(`${t.wa.comment}: ${data.comment}`);
  parts.push("", t.wa.footer);
  return parts.join("\n");
}

export function whatsappUrl(text: string): string {
  const number = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
