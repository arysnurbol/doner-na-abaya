import { site, type Lang } from "@/config/site";
import { categories, products } from "@/data/menu";
import { kz } from "@/i18n/kz";
import { ru } from "@/i18n/ru";

/** Schema.org Restaurant + Menu. Публикуем только проверенные данные из config/site.ts. */
export function JsonLd({ lang }: { lang: Lang }) {
  const t = lang === "ru" ? ru : kz;
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"];
  const url = `${site.url}/${lang}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    alternateName: site.nameLatin,
    description: t.meta.description,
    url,
    image: `${site.url}/og.jpg`,
    telephone: `+${site.phone}`,
    priceRange: site.priceRange,
    servesCuisine: ["Doner", "Shawarma", "Turkish", "Halal"],
    acceptsReservations: false,
    paymentAccepted: "Cash, Credit Card, QR",
    currenciesAccepted: "KZT",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street[lang],
      addressLocality: site.address.city[lang],
      addressRegion: site.address.city[lang],
      postalCode: site.address.postalCode,
      addressCountry: "KZ",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
    hasMap: site.links.twoGis,
    sameAs: [site.instagram, site.links.twoGis, site.links.yandexMaps],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: allDays, opens: "00:00", closes: "23:59" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "00:00", closes: "12:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "14:00", closes: "23:59" },
    ],
    hasMenu: {
      "@type": "Menu",
      name: t.menu.title,
      inLanguage: lang === "ru" ? "ru" : "kk",
      hasMenuSection: categories
        .map((c) => ({
          "@type": "MenuSection",
          name: c.label[lang],
          hasMenuItem: products
            .filter((p) => p.category === c.id)
            .map((p) => ({
              "@type": "MenuItem",
              name: p.name[lang],
              description: p.description[lang],
              offers: p.variants.map((v) => ({
                "@type": "Offer",
                name: p.variants.length > 1 ? `${p.name[lang]} ${v.label[lang]}` : p.name[lang],
                price: v.price,
                priceCurrency: "KZT",
              })),
            })),
        }))
        .filter((s) => s.hasMenuItem.length > 0),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
