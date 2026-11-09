"use client";

import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { productById, upsellIds } from "@/data/menu";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/order";
import { WhatsAppIcon } from "./icons";
import { useStore } from "./store";

type Step = "cart" | "form" | "sent";
type SchemaModule = typeof import("@/lib/checkout-schema");
const loadSchema = () => import("@/lib/checkout-schema");
type Form = { name: string; phone: string; type: "pickup" | "delivery"; address: string; comment: string };
const emptyForm: Form = { name: "", phone: "", type: "pickup", address: "", comment: "" };

export function CartDrawer() {
  const { t, lang, lines, total, count, setQty, clear, add, cartOpen, closeCart } = useStore();
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [waLink, setWaLink] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const schemaMod = useRef<SchemaModule | null>(null);

  // Модуль валидации грузим заранее, когда гость открывает оформление
  useEffect(() => {
    if (step !== "form" || schemaMod.current) return;
    loadSchema().then((m) => (schemaMod.current = m));
  }, [step]);

  // Фокус, Escape и блокировка прокрутки фона
  useEffect(() => {
    if (!cartOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [cartOpen, closeCart]);

  // Пустая корзина всегда показывает шаг «корзина»
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (count === 0 && step === "form") setStep("cart");
  }, [count, step]);

  const inCart = new Set(lines.map((l) => l.productId));
  const hasDoner = lines.some((l) => l.product.isDoner);
  const upsell = hasDoner ? upsellIds.map((id) => productById.get(id)!).filter((p) => !inCart.has(p.id)) : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Обычно модуль уже загружен: тогда WhatsApp открывается синхронно и не блокируется как попап
    const preloaded = schemaMod.current;
    const mod = preloaded ?? (schemaMod.current = await loadSchema());
    const res = mod.checkoutSchema(t.checkout.errors).safeParse(form);
    if (!res.success) {
      const errs: typeof errors = {};
      for (const i of res.error.issues) {
        const k = i.path[0] as keyof Form;
        if (!errs[k]) errs[k] = i.message;
      }
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      panelRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setErrors({});
    const url = whatsappUrl(buildWhatsAppMessage(lines, res.data, lang, t));
    setWaLink(url);
    track("order_submit", { value: total, currency: "KZT", items: count, order_type: res.data.type });
    track("whatsapp_click", { location: "checkout" });
    setStep("sent");
    if (preloaded) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  };

  const close = () => {
    closeCart();
    if (step === "sent") setStep("cart");
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${cartOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
      inert={!cartOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-char/50 backdrop-blur-[2px] transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          {step === "form" && (
            <button onClick={() => setStep("cart")} aria-label={t.checkout.back} className="grid size-11 place-items-center rounded-full hover:bg-studio">
              <ArrowLeft className="size-5" />
            </button>
          )}
          <h2 id="cart-title" className="font-display text-lg font-extrabold">
            {step === "form" ? t.checkout.title : t.cart.title}
          </h2>
          {step === "cart" && count > 0 && <span className="tnum text-sm text-muted">{t.cart.items(count)}</span>}
          <button onClick={close} aria-label={t.cart.close} className="ml-auto grid size-11 place-items-center rounded-full hover:bg-studio">
            <X className="size-5" />
          </button>
        </div>

        {step === "sent" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon className="size-9" />
            </div>
            <h3 className="font-display text-xl font-extrabold">{t.checkout.sentTitle}</h3>
            <p className="text-muted">{t.checkout.sentText}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 font-bold text-char">
              <WhatsAppIcon className="size-5" /> {t.checkout.sentAgain}
            </a>
            <button
              onClick={() => {
                clear();
                setForm(emptyForm);
                setStep("cart");
                closeCart();
              }}
              className="min-h-11 rounded-full px-4 font-medium underline underline-offset-4"
            >
              {t.checkout.sentNew}
            </button>
          </div>
        ) : count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="size-12 text-line" />
            <p className="font-display text-xl font-extrabold">{t.cart.empty}</p>
            <p className="text-muted">{t.cart.emptyHint}</p>
            <a href="#menu" onClick={close} className="mt-2 inline-flex min-h-12 items-center rounded-full bg-char px-6 font-bold text-white">
              {t.cart.toMenu}
            </a>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <ul className="divide-y divide-dashed divide-line">
                {lines.map((l) => (
                  <li key={`${l.productId}:${l.variantId}`} className="flex gap-3 py-3">
                    <div className="relative size-18 shrink-0 overflow-hidden rounded-2xl bg-studio">
                      <Image src={l.product.image} alt="" fill sizes="72px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start gap-2">
                        <p className="flex-1 leading-tight font-bold">
                          {l.product.name[lang]}
                          <span className="ml-1.5 text-sm font-medium text-muted">
                            {l.product.variants.length > 1 ? `${l.variant.label[lang]} · ` : ""}
                            {l.variant.amount[lang]}
                          </span>
                        </p>
                        <button
                          onClick={() => setQty(l.productId, l.variantId, 0)}
                          aria-label={`${t.cart.remove}: ${l.product.name[lang]}`}
                          className="-mt-2 -mr-2 grid size-10 place-items-center rounded-full text-muted hover:text-sauce"
                        >
                          <Trash2 className="size-4.5" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full bg-studio">
                          <button onClick={() => setQty(l.productId, l.variantId, l.qty - 1)} aria-label={t.cart.dec} className="grid size-10 place-items-center rounded-full">
                            <Minus className="size-4" strokeWidth={2.5} />
                          </button>
                          <span className="tnum w-7 text-center font-bold" aria-live="polite">{l.qty}</span>
                          <button onClick={() => setQty(l.productId, l.variantId, l.qty + 1)} aria-label={t.cart.inc} className="grid size-10 place-items-center rounded-full">
                            <Plus className="size-4" strokeWidth={2.5} />
                          </button>
                        </div>
                        <span className="tnum font-bold">{formatPrice(l.sum)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {upsell.length > 0 && (
                <div className="mt-2 mb-4">
                  <p className="mb-2 text-sm font-bold text-muted">{t.cart.upsellTitle}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {upsell.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => add(p.id, p.variants[0].id, 1, { silent: true })}
                        className="group flex flex-col items-center gap-1 rounded-2xl bg-studio p-2 text-center transition-colors hover:bg-saffron"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                          <Image src={p.image} alt="" fill sizes="120px" className="object-cover" />
                        </div>
                        <span className="text-xs leading-tight font-bold">{p.name[lang]}</span>
                        <span className="tnum inline-flex items-center gap-0.5 text-xs">
                          <Plus className="size-3" strokeWidth={3} />
                          {formatPrice(p.variants[0].price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={clear} className="mb-2 min-h-10 text-sm text-muted underline underline-offset-4 hover:text-sauce">
                {t.cart.clear}
              </button>
            </div>
            <div className="border-t border-line bg-white p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-medium">{t.cart.total}</span>
                <span className="tnum font-display text-2xl font-extrabold">{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => {
                  setStep("form");
                  track("begin_checkout", { value: total, currency: "KZT", items: count });
                }}
                className="min-h-13 w-full rounded-full bg-char font-bold text-white transition-colors hover:bg-sauce"
              >
                {t.cart.checkout}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <Field label={t.checkout.name} error={errors.name} id="f-name">
                <input
                  id="f-name"
                  name="name"
                  autoComplete="given-name"
                  maxLength={60}
                  placeholder={t.checkout.namePh}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "f-name-err" : undefined}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label={t.checkout.phone} error={errors.phone} id="f-phone">
                <input
                  id="f-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder={t.checkout.phonePh}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "f-phone-err" : undefined}
                  className={inputCls(!!errors.phone)}
                />
              </Field>
              <fieldset>
                <legend className="mb-1.5 text-sm font-bold">{t.checkout.type}</legend>
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-studio p-1">
                  {(["pickup", "delivery"] as const).map((v) => (
                    <label
                      key={v}
                      className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-sm font-bold transition-colors has-focus-visible:outline-3 ${
                        form.type === v ? "bg-white shadow-sm" : "text-char/65"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={v}
                        checked={form.type === v}
                        onChange={() => setForm({ ...form, type: v })}
                        className="sr-only"
                      />
                      {v === "pickup" ? t.checkout.pickup : t.checkout.delivery}
                    </label>
                  ))}
                </div>
              </fieldset>
              {form.type === "delivery" && (
                <Field label={t.checkout.address} error={errors.address} id="f-address" hint={t.checkout.deliveryNote}>
                  <input
                    id="f-address"
                    name="address"
                    autoComplete="street-address"
                    maxLength={200}
                    placeholder={t.checkout.addressPh}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? "f-address-err" : "f-address-hint"}
                    className={inputCls(!!errors.address)}
                  />
                </Field>
              )}
              <Field label={t.checkout.comment} id="f-comment">
                <textarea
                  id="f-comment"
                  name="comment"
                  rows={2}
                  maxLength={300}
                  placeholder={t.checkout.commentPh}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className={`${inputCls(false)} resize-none py-3`}
                />
              </Field>

              {/* Чек: что уйдёт в WhatsApp */}
              <div className="receipt-edge bg-studio px-4 pt-4 pb-6 font-medium">
                <ul className="space-y-1 text-sm">
                  {lines.map((l) => (
                    <li key={`${l.productId}:${l.variantId}`} className="flex gap-2">
                      <span className="flex-1">
                        {l.product.name[lang]}
                        {l.product.variants.length > 1 ? ` ${l.variant.label[lang]}` : ""} × {l.qty}
                      </span>
                      <span className="tnum">{formatPrice(l.sum)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-dashed border-char/30 pt-2 font-bold">
                  <span>{t.cart.total}</span>
                  <span className="tnum">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-line bg-white p-4">
              <p className="mb-3 text-xs leading-snug text-muted">{t.checkout.notice}</p>
              <button type="submit" className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-bold text-char transition-[filter] hover:brightness-95">
                <WhatsAppIcon className="size-5" />
                {t.checkout.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = (err: boolean) =>
  `block min-h-12 w-full rounded-2xl border-2 bg-white px-4 text-base outline-none transition-colors placeholder:text-char/35 focus:border-char ${
    err ? "border-sauce" : "border-line"
  }`;

function Field({
  label,
  error,
  id,
  hint,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm font-medium text-sauce">
          {error}
        </p>
      )}
    </div>
  );
}
