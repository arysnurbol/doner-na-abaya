import Image from "next/image";
import type { Lang } from "@/config/site";
import { productById } from "@/data/menu";
import type { Dict } from "@/i18n/ru";
import { AddControls } from "@/components/product-card";

export function Signature({ t, lang }: { t: Dict; lang: Lang }) {
  const items = [
    { p: productById.get("doner-chicken")!, line: t.signature.chicken },
    { p: productById.get("doner-beef")!, line: t.signature.beef },
    { p: productById.get("doner-mix")!, line: t.signature.mix },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1] font-extrabold tracking-[-0.02em]">{t.signature.title}</h2>
          <p className="mt-4 text-lg text-muted">{t.signature.lead}</p>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {items.map(({ p, line }) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-[32px] bg-studio">
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.image}
                  alt={p.name[lang]}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  placeholder="blur"
                  className="scale-110 object-cover object-[65%_50%]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-extrabold">{p.name[lang]}</h3>
                  <p className="mt-1.5 text-muted">{line}</p>
                </div>
                <AddControls product={p} size="lg" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
