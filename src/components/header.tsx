"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./icons";
import { OpenStatus } from "./open-status";
import { useStore } from "./store";

export function Header() {
  const { t, lang, count, openCart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (count > 0) setBumpKey((k) => k + 1);
  }, [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "#menu", label: t.nav.menu },
    { href: "#inside", label: t.nav.about },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#location", label: t.nav.location },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,padding] duration-300 ${
        scrolled || open ? "bg-saffron/95 py-2 shadow-[0_1px_0_rgba(33,26,20,.12)] backdrop-blur" : "py-3 sm:py-5"
      }`}
    >
      <a href="#menu" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-full focus:bg-char focus:px-4 focus:py-2 focus:text-white">
        {t.nav.skip}
      </a>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={`/${lang}`} aria-label="Донер на Абая" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label={t.nav.menu} className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 font-medium text-char/80 transition-colors hover:bg-char/8 hover:text-char">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <OpenStatus className="text-char/80" />
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-3">
          <LangSwitch />
          <button
            onClick={openCart}
            aria-label={`${t.cart.open}${count ? `, ${t.cart.items(count)}` : ""}`}
            className="relative grid size-11 place-items-center rounded-full bg-char text-saffron transition-transform active:scale-95"
          >
            <ShoppingBag className="size-5" strokeWidth={2.2} />
            {count > 0 && (
              <span key={bumpKey} className="bump tnum absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-sauce px-1 text-[11px] leading-5 font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <a
            href="#menu"
            className="hidden h-11 items-center rounded-full bg-char px-5 font-bold text-white transition-colors hover:bg-char-soft sm:inline-flex"
          >
            {t.nav.order}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="grid size-11 place-items-center rounded-full lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label={t.nav.menu} className="mx-auto max-w-7xl px-4 pt-2 pb-5 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-3 font-display text-2xl font-extrabold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <OpenStatus className="mt-3 px-3 text-char/80" />
        </nav>
      )}
    </header>
  );
}

function LangSwitch() {
  const { t, lang } = useStore();
  return (
    <div role="group" aria-label={t.nav.langLabel} className="flex rounded-full bg-char/8 p-1 text-sm font-bold">
      {(["ru", "kz"] as const).map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          hrefLang={l === "ru" ? "ru" : "kk"}
          aria-current={l === lang ? "page" : undefined}
          className={`grid h-9 min-w-10 place-items-center rounded-full px-2 uppercase transition-colors ${
            l === lang ? "bg-white text-char shadow-sm" : "text-char/85 hover:text-char"
          }`}
        >
          {l === "ru" ? "RU" : "KZ"}
        </Link>
      ))}
    </div>
  );
}
