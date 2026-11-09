"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";
import { useStore } from "./store";

/** Карта Яндекса грузится только по клику — не тормозит первую загрузку. */
export function MapFacade() {
  const { t, lang } = useStore();
  const [show, setShow] = useState(false);
  const src = lang === "kz" ? site.links.yandexMapEmbed.replace("lang=ru_RU", "lang=kk_KZ") : site.links.yandexMapEmbed;

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-[28px] bg-char">
      {show ? (
        <iframe src={src} title={t.location.mapTitle} className="absolute inset-0 size-full border-0" loading="lazy" allowFullScreen />
      ) : (
        <button
          onClick={() => {
            setShow(true);
            track("map_click", { location: "map_embed" });
          }}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"
        >
          {/* Схематичная «карта»: сетка кварталов */}
          <svg aria-hidden="true" className="absolute inset-0 size-full opacity-25" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
            <g stroke="#ffc21a" strokeWidth="1" fill="none">
              {Array.from({ length: 9 }, (_, i) => (
                <path key={`h${i}`} d={`M0 ${i * 36 + 10} L400 ${i * 36 - 30}`} />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <path key={`v${i}`} d={`M${i * 40} 0 L${i * 40 + 60} 300`} />
              ))}
              <path d="M0 200 C120 160 260 240 400 150" strokeWidth="6" stroke="#f08913" />
            </g>
          </svg>
          <span className="relative grid size-16 place-items-center rounded-full bg-saffron text-char shadow-[0_0_0_10px_rgba(255,194,26,.25)] transition-transform group-hover:scale-110">
            <MapPin className="size-8" strokeWidth={2.4} />
          </span>
          <span className="relative rounded-full bg-white px-5 py-3 font-bold text-char">{t.location.showMap}</span>
        </button>
      )}
    </div>
  );
}
