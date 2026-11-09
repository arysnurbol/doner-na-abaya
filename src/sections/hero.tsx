import Image from "next/image";
import { Star } from "lucide-react";
import { site, type Lang } from "@/config/site";
import { productById } from "@/data/menu";
import type { Dict } from "@/i18n/ru";
import { formatPrice } from "@/lib/format";
import { OrderButton } from "@/components/cart-ui";
import { OpenStatus } from "@/components/open-status";
import heroImg from "@/assets/menu/chicken-m.webp";

export function Hero({ t, lang }: { t: Dict; lang: Lang }) {
  const minPrice = productById.get("doner-chicken")!.variants[0].price;
  const ratingCount = site.rating.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <section id="top" className="relative overflow-hidden bg-saffron pt-24 pb-12 sm:pt-32 lg:pb-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6">
        <div className="relative z-10 lg:col-span-6">
          <h1 className="hero-title font-display text-[clamp(2.4rem,8.4vw,5.6rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-char">
            <span className="block">{t.hero.titleA}</span>
            <span className="block">{t.hero.titleB}</span>
          </h1>
          <p className="hero-rise mt-5 max-w-[34ch] text-lg leading-snug text-char/80 [animation-delay:.1s] sm:text-xl">
            {t.hero.lead}
          </p>
          <div className="hero-rise mt-7 flex flex-wrap gap-3 [animation-delay:.2s]">
            <OrderButton className="inline-flex min-h-14 items-center rounded-full bg-char px-7 text-lg font-bold text-white shadow-[0_10px_30px_-10px_rgba(33,26,20,.6)] transition-[background-color,transform] hover:bg-sauce active:scale-[.98]">
              {t.hero.ctaPrimary}
            </OrderButton>
            <a
              href="#menu"
              className="inline-flex min-h-14 items-center rounded-full border-2 border-char px-7 text-lg font-bold text-char transition-colors hover:bg-char hover:text-white"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
          <div className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 [animation-delay:.3s]">
            <a href={site.links.twoGisReviews} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-medium text-char hover:underline">
              <span className="inline-flex items-center gap-1 rounded-full bg-char px-2.5 py-1 font-bold text-saffron">
                <Star className="size-4 fill-saffron" strokeWidth={0} />
                {site.rating.value.toString().replace(".", ",")}
              </span>
              <span className="tnum">
                {ratingCount} {t.hero.ratingLabel}
              </span>
            </a>
            <div className="md:hidden">
              <OpenStatus className="text-char" />
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px] overflow-hidden rounded-[40px] bg-studio sm:rounded-[56px] lg:mr-[-6%] lg:ml-0 lg:w-[112%] lg:max-w-none">
            <Image
              src={heroImg}
              alt={t.hero.imgAlt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="scale-[1.18] object-cover object-[62%_55%]"
            />
          </div>
          <div className="absolute -bottom-4 left-2 grid size-28 rotate-[-10deg] place-items-center rounded-full bg-sauce text-center text-white shadow-xl sm:-bottom-6 sm:left-0 sm:size-36 lg:-left-6">
            <span className="leading-tight">
              <span className="block text-sm font-medium">{lang === "ru" ? t.hero.from : ""}</span>
              <span className="tnum block font-display text-lg font-extrabold sm:text-2xl">{formatPrice(minPrice)}</span>
              <span className="block text-sm font-medium">{lang === "kz" ? t.hero.from : ""}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
