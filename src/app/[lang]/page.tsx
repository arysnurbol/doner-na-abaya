import { notFound } from "next/navigation";
import { isLang } from "@/config/site";
import { kz } from "@/i18n/kz";
import { ru } from "@/i18n/ru";
import { CartDrawer } from "@/components/cart-drawer";
import { CartToast, MobileBar } from "@/components/cart-ui";
import { Header } from "@/components/header";
import { Facts } from "@/sections/facts";
import { Hero } from "@/sections/hero";
import { FinalCta, Footer, GallerySection, Location, Meal, MenuSection, Reviews } from "@/sections/rest";
import { Signature } from "@/sections/signature";
import { Story } from "@/sections/story";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = lang === "ru" ? ru : kz;

  return (
    <>
      <Header />
      <main>
        <Hero t={t} lang={lang} />
        <Facts t={t} />
        <Signature t={t} lang={lang} />
        <Story t={t} />
        <MenuSection t={t} />
        <Meal t={t} lang={lang} />
        <Reviews t={t} />
        <GallerySection t={t} />
        <Location t={t} lang={lang} />
        <FinalCta t={t} />
      </main>
      <Footer t={t} lang={lang} />
      <MobileBar />
      <CartToast />
      <CartDrawer />
    </>
  );
}
