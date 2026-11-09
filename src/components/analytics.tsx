"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { site, type Lang } from "@/config/site";
import { kz } from "@/i18n/kz";
import { ru } from "@/i18n/ru";

const KEY = "dna-analytics-consent";
const ga = site.analytics.ga4;
const ym = site.analytics.yandexMetrica;
const valid = (id: string, re: RegExp) => (re.test(id) ? id : "");
const gaId = valid(ga, /^G-[A-Z0-9]{4,}$/);
const ymId = valid(ym, /^\d{4,12}$/);

/**
 * GA4 и Яндекс Метрика. Ничего не загружается, пока не заданы ID (env) и пользователь не согласился.
 */
export function Analytics({ lang }: { lang: Lang }) {
  const [consent, setConsent] = useState<"yes" | "no" | null | "unknown">("unknown");

  useEffect(() => {
    let v: string | null = null;
    try {
      v = window.localStorage.getItem(KEY);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(v === "yes" || v === "no" ? v : null);
  }, []);

  if (!gaId && !ymId) return null;

  const decide = (v: "yes" | "no") => {
    try {
      window.localStorage.setItem(KEY, v);
    } catch {}
    setConsent(v);
  };

  const t = (lang === "ru" ? ru : kz).consent;

  return (
    <>
      {consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl bg-char p-4 text-sm text-white shadow-2xl sm:bottom-4 sm:flex-row sm:items-center"
        >
          <p className="flex-1">{t.text}</p>
          <div className="flex gap-2">
            <button onClick={() => decide("no")} className="min-h-11 rounded-full px-4 text-white/80 hover:text-white">
              {t.decline}
            </button>
            <button
              onClick={() => decide("yes")}
              className="min-h-11 rounded-full bg-saffron px-5 font-bold text-char"
            >
              {t.accept}
            </button>
          </div>
        </div>
      )}
      {consent === "yes" && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {consent === "yes" && ymId && (
        <Script id="ym" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
        </Script>
      )}
    </>
  );
}
