/**
 * Единый источник бизнес-данных сайта.
 *
 * Источник: карточка 2ГИС https://2gis.kz/astana/firm/70000001087620672
 * (филиал ул. Едил, 26). Проверено 09.11.2026.
 * Поля с `TODO:` нужно подтвердить у владельца перед запуском.
 */
export const site = {
  name: "Донер на Абая",
  nameLatin: "Doner na Abaya",

  /** Домен сайта. TODO: задать NEXT_PUBLIC_SITE_URL после покупки домена. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://doner-na-abaya.vercel.app").replace(/\/$/, ""),

  /** Телефон и WhatsApp из карточки 2ГИС. Только цифры, с кодом страны. */
  phone: "77470308969",
  phoneDisplay: "+7 747 030 89 69",
  whatsapp: "77470308969",

  instagram: "https://instagram.com/doner_na_abaya_astanaa",
  instagramHandle: "@doner_na_abaya_astanaa",

  address: {
    street: { ru: "ул. Едил, 26", kz: "Едил көшесі, 26" },
    district: {
      ru: "ж/м Юго-Восток (левая сторона), Алматинский район",
      kz: "Оңтүстік-Шығыс (сол жақ) т/а, Алматы ауданы",
    },
    city: { ru: "Астана", kz: "Астана" },
    postalCode: "Z00E9Y8",
    landmark: {
      ru: "250 м от Городской больницы №1",
      kz: "№1 қалалық ауруханадан 250 м",
    },
  },

  /** Координаты взяты из ссылки маршрута 2ГИС. */
  geo: { lat: 51.145146, lon: 71.526859 },

  /**
   * Круглосуточно, перерыв по пятницам 12:30–14:00 (данные 2ГИС).
   * Время — Астана (UTC+5).
   */
  hours: {
    open24h: true,
    breaks: [{ day: 5, from: "12:30", to: "14:00" }] as const,
  },

  /** Рейтинг из 2ГИС на дату проверки. Обновляйте вручную. */
  rating: { value: 4.9, count: 8506, checkedAt: "2026-11-09" },

  payment: { ru: ["Карта", "Наличные", "QR-код"], kz: ["Карта", "Қолма-қол", "QR-код"] },
  seats: 16,
  priceRange: "₸₸",

  links: {
    twoGis: "https://2gis.kz/astana/firm/70000001087620672",
    twoGisReviews: "https://2gis.kz/astana/firm/70000001087620672/tab/reviews",
    twoGisRoute:
      "https://2gis.kz/astana/directions/points/%7C71.526859%2C51.145146%3B70000001087620672",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=51.145146%2C71.526859",
    yandexMaps: "https://yandex.kz/maps/org/doner_na_abaya/104276015044/",
    yandexMapEmbed:
      "https://yandex.ru/map-widget/v1/?ll=71.526859%2C51.145146&z=16&pt=71.526859%2C51.145146%2Cpm2rdm&lang=ru_RU",
  },

  /** Доставка указана в 2ГИС, условия (зона, цена) — TODO: уточнить у владельца. */
  delivery: { available: true },

  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    yandexMetrica: process.env.NEXT_PUBLIC_YM_ID ?? "",
  },
} as const;

export type Lang = "ru" | "kz";
export const langs: Lang[] = ["ru", "kz"];
export const htmlLang: Record<Lang, string> = { ru: "ru", kz: "kk" };
export const isLang = (v: string): v is Lang => v === "ru" || v === "kz";
