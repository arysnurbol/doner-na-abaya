import Image from "next/image";
import { Clock, CreditCard, MapPin, Phone, Star, Users } from "lucide-react";
import { site, type Lang } from "@/config/site";
import { mealSet, productById } from "@/data/menu";
import { reviews } from "@/data/reviews";
import type { Dict } from "@/i18n/ru";
import { formatPrice, telHref } from "@/lib/format";
import { AddSetButton, OrderButton } from "@/components/cart-ui";
import { Gallery } from "@/components/gallery";
import { InstagramIcon, Logo, WhatsAppIcon } from "@/components/icons";
import { MapFacade } from "@/components/map-facade";
import { MenuCatalog } from "@/components/menu-catalog";
import { TrackLink } from "@/components/track-link";
import { whatsappUrl } from "@/lib/order";
import chickenS from "@/assets/menu/chicken-s.webp";
import mix from "@/assets/menu/mix.webp";
import beef from "@/assets/menu/beef.webp";
import combo from "@/assets/menu/combo-2.webp";
import fries from "@/assets/menu/fries.webp";
import ayran from "@/assets/menu/ayran.webp";

const H2 = "font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1] font-extrabold tracking-[-0.02em]";

export function MenuSection({ t }: { t: Dict }) {
  return (
    <section id="menu" className="scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={`${H2} text-[clamp(2.6rem,8vw,5.5rem)]`}>{t.menu.title}</h2>
          <p className="max-w-md text-muted">{t.menu.lead}</p>
        </div>
        <div className="mt-6">
          <MenuCatalog />
        </div>
      </div>
    </section>
  );
}

export function Meal({ t, lang }: { t: Dict; lang: Lang }) {
  const set = mealSet.map((m) => {
    const p = productById.get(m.productId)!;
    const v = p.variants.find((x) => x.id === m.variantId)!;
    return { p, v };
  });
  const setTotal = set.reduce((s, x) => s + x.v.price, 0);
  const combo2 = productById.get("combo-two")!;

  return (
    <section className="bg-saffron py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
        <div className="flex flex-col rounded-[36px] bg-white p-6 sm:p-10">
          <h2 className={`${H2} text-[clamp(1.8rem,4vw,3rem)]`}>{t.meal.title}</h2>
          <p className="mt-3 max-w-md text-lg text-muted">{t.meal.lead}</p>
          <div className="my-8 flex items-center">
            {[chickenS, fries, ayran].map((img, i) => (
              <div
                key={i}
                className={`relative aspect-square w-1/3 max-w-40 overflow-hidden rounded-full border-4 border-white bg-studio ${i ? "-ml-6" : ""}`}
                style={{ zIndex: 3 - i }}
              >
                <Image src={img} alt="" fill sizes="160px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="receipt-edge mt-auto bg-studio px-5 pt-5 pb-8">
            <ul className="space-y-1.5">
              {set.map(({ p, v }) => (
                <li key={p.id} className="flex gap-3">
                  <span className="flex-1">
                    {p.name[lang]}
                    {p.variants.length > 1 ? ` ${v.label[lang]}` : ""}
                  </span>
                  <span className="tnum font-medium">{formatPrice(v.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-char/30 pt-3">
              <span className="font-bold">{t.meal.total}</span>
              <span className="tnum font-display text-2xl font-extrabold">{formatPrice(setTotal)}</span>
            </div>
          </div>
          <AddSetButton
            items={mealSet}
            className="mt-5 min-h-14 w-full rounded-full bg-char text-lg font-bold text-white transition-colors hover:bg-sauce sm:w-auto sm:self-start sm:px-8"
          >
            {t.meal.addAll}
          </AddSetButton>
        </div>

        <div className="flex flex-col overflow-hidden rounded-[36px] bg-char text-white">
          <div className="relative aspect-[4/3] bg-studio">
            <Image src={combo} alt={combo2.name[lang]} fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{t.meal.twoTitle}</h3>
            <p className="mt-2 text-white/70">{t.meal.twoLead}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="tnum font-display text-3xl font-extrabold text-saffron">{formatPrice(combo2.variants[0].price)}</span>
              <AddSetButton
                items={[{ productId: combo2.id, variantId: combo2.variants[0].id }]}
                className="min-h-13 rounded-full bg-saffron px-7 font-bold text-char transition-colors hover:bg-white"
              >
                {t.meal.twoAdd}
              </AddSetButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews({ t }: { t: Dict }) {
  const count = site.rating.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (
    <section id="reviews" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className={H2}>{t.reviews.title}</h2>
            <p className="mt-4 max-w-xl text-lg text-muted">{t.reviews.lead}</p>
          </div>
          <a
            href={site.links.twoGisReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[28px] bg-saffron px-6 py-4 transition-transform hover:-rotate-1"
          >
            <span className="font-display text-5xl font-extrabold">{site.rating.value.toString().replace(".", ",")}</span>
            <span>
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-char" strokeWidth={0} />
                ))}
              </span>
              <span className="tnum mt-1 block text-sm font-medium">
                {count} {t.hero.ratingLabel}
              </span>
            </span>
          </a>
        </div>

        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {reviews.map((r, i) => (
            <li
              key={i}
              lang={r.lang === "kz" ? "kk" : "ru"}
              className={`flex w-[82%] shrink-0 snap-start flex-col rounded-[28px] p-6 sm:w-[46%] lg:w-auto ${
                i % 3 === 0 ? "bg-char text-white" : "bg-studio"
              }`}
            >
              <span aria-hidden="true" className={`font-display text-5xl leading-none ${i % 3 === 0 ? "text-saffron" : "text-ember"}`}>
                “
              </span>
              <blockquote className="mt-1 flex-1 text-lg leading-snug">{r.text}</blockquote>
              <p className={`mt-5 text-sm ${i % 3 === 0 ? "text-white/60" : "text-muted"}`}>
                {t.reviews.source}
                <br />
                {t.reviews.visits(r.visits)}
              </p>
            </li>
          ))}
        </ul>
        <a
          href={site.links.twoGisReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center rounded-full border-2 border-char px-6 font-bold transition-colors hover:bg-char hover:text-white"
        >
          {t.reviews.all}
        </a>
      </div>
    </section>
  );
}

export function GallerySection({ t }: { t: Dict }) {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className={H2}>{t.gallery.title}</h2>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-bold hover:underline">
            <InstagramIcon className="size-5" />
            {t.gallery.more}
          </a>
        </div>
        <Gallery images={[chickenS, combo, fries, ayran, mix, beef]} />
      </div>
    </section>
  );
}

export function Location({ t, lang }: { t: Dict; lang: Lang }) {
  const a = site.address;
  const quick = whatsappUrl(t.wa.quick);
  return (
    <section id="location" className="bg-char py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className={`${H2} text-white`}>{t.location.title}</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <Info icon={<MapPin />} label={t.location.address}>
              <span className="font-display text-xl font-extrabold text-saffron">{a.street[lang]}</span>
              <br />
              {a.district[lang]}, {a.city[lang]}
              <br />
              <span className="text-white/60">{a.landmark[lang]}</span>
            </Info>
            <Info icon={<Clock />} label={t.location.hours}>
              <span className="font-display text-xl font-extrabold text-saffron">{t.location.hoursText}</span>
              <br />
              {t.location.hoursBreak}
            </Info>
            <Info icon={<Phone />} label={t.location.phone}>
              <TrackLink event="phone_click" where="location" external={false} href={telHref(site.phone)} className="tnum font-display text-xl font-extrabold text-saffron hover:underline">
                {site.phoneDisplay}
              </TrackLink>
            </Info>
            <Info icon={<CreditCard />} label={t.location.payment}>
              {site.payment[lang].join(", ")}
              <br />
              <span className="inline-flex items-center gap-1.5 text-white/60">
                <Users className="size-4" /> {t.location.seats}
              </span>
            </Info>
          </dl>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <TrackLink event="whatsapp_click" where="location" href={quick} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 font-bold text-char">
              <WhatsAppIcon className="size-5" /> {t.location.whatsapp}
            </TrackLink>
            <TrackLink event="phone_click" where="location_btn" external={false} href={telHref(site.phone)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold text-char">
              <Phone className="size-4.5" /> {t.location.call}
            </TrackLink>
            <TrackLink event="map_click" where="2gis_route" href={site.links.twoGisRoute} className="inline-flex min-h-12 items-center rounded-full bg-saffron px-5 font-bold text-char">
              {t.location.route}
            </TrackLink>
            <TrackLink event="map_click" where="google" href={site.links.googleMaps} className="inline-flex min-h-12 items-center rounded-full border-2 border-white/25 px-5 font-bold hover:border-white">
              {t.location.google}
            </TrackLink>
            <TrackLink event="map_click" where="yandex" href={site.links.yandexMaps} className="inline-flex min-h-12 items-center rounded-full border-2 border-white/25 px-5 font-bold hover:border-white">
              {t.location.yandex}
            </TrackLink>
          </div>
        </div>
        <MapFacade />
      </div>
    </section>
  );
}

function Info({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-8">
      <dt className="text-sm text-white/60">
        <span aria-hidden="true" className="absolute top-0.5 left-0 text-saffron [&>svg]:size-5">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 leading-relaxed">{children}</dd>
    </div>
  );
}

export function FinalCta({ t }: { t: Dict }) {
  return (
    <section className="relative overflow-hidden bg-saffron">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-20">
        <div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">{t.finalCta.title}</h2>
          <p className="mt-4 text-xl text-char/80">{t.finalCta.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <OrderButton className="inline-flex min-h-14 items-center rounded-full bg-char px-7 text-lg font-bold text-white transition-colors hover:bg-sauce">
              {t.finalCta.order}
            </OrderButton>
            <a href="#menu" className="inline-flex min-h-14 items-center rounded-full border-2 border-char px-7 text-lg font-bold transition-colors hover:bg-char hover:text-white">
              {t.finalCta.menu}
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md rotate-3 overflow-hidden rounded-[48px] bg-studio">
          <Image src={mix} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="scale-125 object-cover object-[60%_50%]" />
        </div>
      </div>
    </section>
  );
}

export function Footer({ t, lang }: { t: Dict; lang: Lang }) {
  const year = 2026;
  return (
    <footer className="bg-char pt-14 pb-28 text-white/75 lg:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs">{t.footer.about}</p>
          <div className="mt-5 flex gap-2">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${site.instagramHandle}`} className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-saffron hover:text-char">
              <InstagramIcon className="size-5" />
            </a>
            <TrackLink event="whatsapp_click" where="footer" href={whatsappUrl(t.wa.quick)} aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-[#25D366] hover:text-char">
              <WhatsAppIcon className="size-5" />
            </TrackLink>
            <a href={site.links.twoGis} target="_blank" rel="noopener noreferrer" aria-label="2ГИС" className="grid h-11 place-items-center rounded-full bg-white/10 px-4 text-sm font-bold text-white hover:bg-saffron hover:text-char">
              2ГИС
            </a>
          </div>
        </div>
        <nav aria-label={t.footer.nav}>
          <p className="font-bold text-white">{t.footer.nav}</p>
          <ul className="mt-3 space-y-1">
            {[
              ["#menu", t.nav.menu],
              ["#inside", t.nav.about],
              ["#reviews", t.nav.reviews],
              ["#location", t.nav.location],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-block py-1.5 hover:text-saffron">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-bold text-white">{t.footer.contacts}</p>
          <ul className="mt-3 space-y-2">
            <li>
              {site.address.street[lang]}, {site.address.city[lang]}
            </li>
            <li>
              {t.location.hoursText}. {t.location.hoursBreak}
            </li>
            <li>
              <TrackLink event="phone_click" where="footer" external={false} href={telHref(site.phone)} className="tnum hover:text-saffron">
                {site.phoneDisplay}
              </TrackLink>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-saffron">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-4 text-sm text-white/50 sm:px-6">
        <div className="border-t border-white/10 pt-6">
          <p>{t.footer.disclaimer}</p>
          <p className="mt-2">
            © {year} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
