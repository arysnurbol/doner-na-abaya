import Image from "next/image";
import type { Dict } from "@/i18n/ru";
import detail from "@/assets/menu/beef-detail.webp";

export function Story({ t }: { t: Dict }) {
  return (
    <section id="inside" className="overflow-hidden bg-studio py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative -mx-4 sm:mx-0">
          <Image
            src={detail}
            alt={t.story.imgAlt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder="blur"
            className="h-auto w-full sm:rounded-[40px]"
          />
        </div>
        <div>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1] font-extrabold tracking-[-0.02em]">{t.story.title}</h2>
          <p className="mt-4 text-lg text-muted">{t.story.lead}</p>
          <dl className="mt-8 border-t-2 border-char">
            {t.story.parts.map((part) => (
              <div key={part.name} className="grid gap-1 border-b border-char/15 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="font-display text-lg font-extrabold">{part.name}</dt>
                <dd className="text-char/75">{part.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
