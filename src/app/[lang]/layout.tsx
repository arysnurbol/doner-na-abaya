import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { htmlLang, isLang, langs, site } from "@/config/site";
import { kz } from "@/i18n/kz";
import { ru } from "@/i18n/ru";
import { StoreProvider } from "@/components/store";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import "../globals.css";

// cyrillic-ext содержит казахские буквы (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ)
const montserrat = Montserrat({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#ffc21a",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = lang === "ru" ? ru : kz;
  const url = `${site.url}/${lang}`;
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: url,
      languages: { ru: `${site.url}/ru`, kk: `${site.url}/kz`, "x-default": `${site.url}/ru` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "ru" ? "ru_KZ" : "kk_KZ",
      alternateLocale: lang === "ru" ? ["kk_KZ"] : ["ru_KZ"],
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/og.jpg"],
    },
    robots: { index: true, follow: true },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={htmlLang[lang]} className={montserrat.variable}>
      <body>
        <JsonLd lang={lang} />
        <StoreProvider lang={lang}>{children}</StoreProvider>
        <Analytics lang={lang} />
      </body>
    </html>
  );
}
