/**
 * Меню филиала ул. Едил, 26.
 *
 * Источник: меню филиала в Яндекс Картах / Яндекс Еде
 * (https://yandex.kz/maps/org/doner_na_abaya/104276015044/menu/),
 * последнее обновление на площадке — 19.11.2025.
 * Цены на площадках доставки могут отличаться от цен в кассе.
 * TODO: сверить цены с кассой перед запуском (см. README → «Как поменять цены»).
 *
 * Как поменять цену: найдите позицию по `id` и измените `price` в нужном варианте.
 */
import type { StaticImageData } from "next/image";
import chickenM from "@/assets/menu/chicken-m.webp";
import beef from "@/assets/menu/beef.webp";
import mix from "@/assets/menu/mix.webp";
import combo2 from "@/assets/menu/combo-2.webp";
import fries from "@/assets/menu/fries.webp";
import ayran from "@/assets/menu/ayran.webp";
import cola from "@/assets/menu/cola.webp";
import fanta from "@/assets/menu/fanta.webp";
import sprite from "@/assets/menu/sprite.webp";
import fusetea from "@/assets/menu/fusetea.webp";
import bonaqua from "@/assets/menu/bonaqua.webp";
import sauceWhite from "@/assets/menu/sauce-white.webp";
import sauceCheese from "@/assets/menu/sauce-cheese.webp";
import sauceBbq from "@/assets/menu/sauce-bbq.webp";
import ketchup from "@/assets/menu/ketchup.webp";
import jalapeno from "@/assets/menu/jalapeno.webp";

export type L10n = { ru: string; kz: string };

export type CategoryId = "chicken" | "beef" | "mix" | "combo" | "drinks" | "extras";

export type Variant = {
  id: string;
  label: L10n;
  /** Вес или объём порции. */
  amount: L10n;
  /** Цена в тенге. */
  price: number;
};

export type Product = {
  id: string;
  category: CategoryId;
  name: L10n;
  description: L10n;
  image: StaticImageData;
  variants: Variant[];
  /** Донеры: к ним в корзине предлагаем фри и напиток. */
  isDoner?: boolean;
};

export const categories: { id: CategoryId; label: L10n }[] = [
  { id: "chicken", label: { ru: "Куриный", kz: "Тауық" } },
  { id: "beef", label: { ru: "Говяжий", kz: "Сиыр еті" } },
  { id: "mix", label: { ru: "Ассорти", kz: "Ассорти" } },
  { id: "combo", label: { ru: "Комбо", kz: "Комбо" } },
  { id: "drinks", label: { ru: "Напитки", kz: "Сусындар" } },
  { id: "extras", label: { ru: "Дополнительно", kz: "Қосымша" } },
];

const donerSizes = (s: number, m: number): Variant[] => [
  { id: "S", label: { ru: "S", kz: "S" }, amount: { ru: "370 г", kz: "370 г" }, price: s },
  { id: "M", label: { ru: "M", kz: "M" }, amount: { ru: "450 г", kz: "450 г" }, price: m },
];

const sodaSizes = (): Variant[] => [
  { id: "bottle", label: { ru: "Бутылка", kz: "Бөтелке" }, amount: { ru: "0,5 л", kz: "0,5 л" }, price: 895 },
  { id: "can", label: { ru: "Банка", kz: "Банка" }, amount: { ru: "0,45 л", kz: "0,45 л" }, price: 945 },
];

const single = (amount: string, price: number): Variant[] => [
  { id: "one", label: { ru: amount, kz: amount }, amount: { ru: amount, kz: amount }, price },
];

export const products: Product[] = [
  {
    id: "doner-chicken",
    category: "chicken",
    isDoner: true,
    name: { ru: "Донер куриный", kz: "Тауық донері" },
    description: {
      ru: "Тонкий лаваш с лазджаном, маринованная халяльная курица, лёгкий белый соус и солёные огурцы.",
      kz: "Лазджан қосылған жұқа лаваш, маринадталған халал тауық еті, жеңіл ақ соус және тұздалған қияр.",
    },
    image: chickenM,
    variants: donerSizes(2595, 2895),
  },
  {
    id: "doner-beef",
    category: "beef",
    isDoner: true,
    name: { ru: "Донер говяжий", kz: "Сиыр еті донері" },
    description: {
      ru: "Тонкий лаваш с лазджаном, маринованная халяльная говядина, лёгкий белый соус и солёные огурцы.",
      kz: "Лазджан қосылған жұқа лаваш, маринадталған халал сиыр еті, жеңіл ақ соус және тұздалған қияр.",
    },
    image: beef,
    variants: donerSizes(2795, 3095),
  },
  {
    id: "doner-mix",
    category: "mix",
    isDoner: true,
    name: { ru: "Донер ассорти", kz: "Ассорти донер" },
    description: {
      ru: "Курица и говядина вместе: тонкий лаваш с лазджаном, белый соус и солёные огурцы.",
      kz: "Тауық пен сиыр еті бірге: лазджан қосылған жұқа лаваш, ақ соус және тұздалған қияр.",
    },
    image: mix,
    variants: donerSizes(2795, 3095),
  },
  {
    id: "combo-two",
    category: "combo",
    name: { ru: "Комбо на двоих", kz: "Екі адамға комбо" },
    description: {
      ru: "Два куриных донера M и два напитка на выбор. Напитки укажите в комментарии к заказу.",
      kz: "Екі тауық донері M және таңдауыңызша екі сусын. Сусындарды тапсырысқа пікірде жазыңыз.",
    },
    image: combo2,
    variants: single("1 кг", 7580),
  },
  {
    id: "fries",
    category: "extras",
    name: { ru: "Картофель фри", kz: "Фри картобы" },
    description: {
      ru: "Хрустящий, с золотистой корочкой, только что из фритюра.",
      kz: "Қытырлақ, алтын түсті қабықшасы бар, жаңа ғана қуырылған.",
    },
    image: fries,
    variants: single("103 г", 895),
  },
  {
    id: "ayran",
    category: "drinks",
    name: { ru: "Айран", kz: "Айран" },
    description: { ru: "Кисломолочный напиток.", kz: "Ашытылған сүт сусыны." },
    image: ayran,
    variants: single("0,3 л", 695),
  },
  {
    id: "coca-cola",
    category: "drinks",
    name: { ru: "Coca-Cola", kz: "Coca-Cola" },
    description: { ru: "Газированный напиток.", kz: "Газдалған сусын." },
    image: cola,
    variants: sodaSizes(),
  },
  {
    id: "fanta",
    category: "drinks",
    name: { ru: "Fanta", kz: "Fanta" },
    description: { ru: "Газированный напиток.", kz: "Газдалған сусын." },
    image: fanta,
    variants: sodaSizes(),
  },
  {
    id: "sprite",
    category: "drinks",
    name: { ru: "Sprite", kz: "Sprite" },
    description: { ru: "Газированный напиток.", kz: "Газдалған сусын." },
    image: sprite,
    variants: sodaSizes(),
  },
  {
    id: "fuse-tea",
    category: "drinks",
    name: { ru: "Fuse tea", kz: "Fuse tea" },
    description: { ru: "Холодный чай.", kz: "Салқын шай." },
    image: fusetea,
    variants: sodaSizes(),
  },
  {
    id: "bonaqua",
    category: "drinks",
    name: { ru: "BonAqua без газа", kz: "BonAqua газсыз" },
    description: { ru: "Питьевая вода.", kz: "Ауыз су." },
    image: bonaqua,
    variants: single("0,5 л", 695),
  },
  {
    id: "sauce-white",
    category: "extras",
    name: { ru: "Белый соус", kz: "Ақ соус" },
    description: { ru: "Фирменный соус.", kz: "Фирмалық соус." },
    image: sauceWhite,
    variants: single("30 г", 200),
  },
  {
    id: "sauce-cheese",
    category: "extras",
    name: { ru: "Сырный соус", kz: "Ірімшік соусы" },
    description: { ru: "Соус к картофелю фри.", kz: "Фри картобына соус." },
    image: sauceCheese,
    variants: single("25 мл", 200),
  },
  {
    id: "sauce-bbq",
    category: "extras",
    name: { ru: "Соус барбекю", kz: "Барбекю соусы" },
    description: { ru: "Соус к картофелю фри.", kz: "Фри картобына соус." },
    image: sauceBbq,
    variants: single("25 г", 200),
  },
  {
    id: "ketchup",
    category: "extras",
    name: { ru: "Кетчуп", kz: "Кетчуп" },
    description: { ru: "Соус к картофелю фри.", kz: "Фри картобына соус." },
    image: ketchup,
    variants: single("25 мл", 200),
  },
  {
    id: "jalapeno",
    category: "extras",
    name: { ru: "Перчики халапеньо", kz: "Халапеньо бұрышы" },
    description: { ru: "Острая добавка к донеру.", kz: "Донерге ащы қосымша." },
    image: jalapeno,
    variants: single("7 г", 150),
  },
];

export const productById = new Map(products.map((p) => [p.id, p]));

/** Что предлагаем добавить к донеру (апселл в корзине). */
export const upsellIds = ["fries", "ayran", "sauce-white"] as const;

/** Набор «Донер + фри + айран»: просто сумма позиций, без скидки. */
export const mealSet = [
  { productId: "doner-chicken", variantId: "M" },
  { productId: "fries", variantId: "one" },
  { productId: "ayran", variantId: "one" },
] as const;

