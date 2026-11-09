import type { Dict } from "@/i18n/ru";

export function Facts({ t }: { t: Dict }) {
  return (
    <section aria-label="Донер на Абая" className="bg-char text-white">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
        {t.facts.map((f, i) => (
          <li
            key={f.big}
            className={`py-7 sm:py-9 ${i % 2 === 1 ? "border-l border-white/12 pl-5" : "pr-4"} lg:border-l lg:border-white/12 lg:px-6 ${i === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}
          >
            <p className="font-display text-3xl font-extrabold text-saffron sm:text-4xl">{f.big}</p>
            <p className="mt-1.5 text-sm leading-snug text-white/70 sm:text-base">{f.small}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
