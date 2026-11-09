"use client";

import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";

const spans = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1 sm:col-span-2",
  "col-span-1 row-span-1 sm:col-span-2",
];

export function Gallery({ images }: { images: StaticImageData[] }) {
  const { t } = useStore();
  const [idx, setIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (idx !== null && !d.open) d.showModal();
    if (idx === null && d.open) d.close();
  }, [idx]);

  const step = (n: number) => setIdx((i) => (i === null ? i : (i + n + images.length) % images.length));

  return (
    <>
      <ul className="grid auto-rows-[38vw] grid-cols-2 gap-2 sm:auto-rows-[200px] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[230px]">
        {images.map((img, i) => (
          <li key={i} className={spans[i] ?? ""}>
            <button
              onClick={() => setIdx(i)}
              className="group relative block size-full overflow-hidden rounded-[22px] bg-studio"
              aria-label={t.gallery.items[i]}
            >
              <Image
                src={img}
                alt={t.gallery.items[i]}
                fill
                sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                placeholder="blur"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIdx(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === e.currentTarget && setIdx(null)}
        className="m-auto size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-char/90"
        aria-label={idx !== null ? t.gallery.items[idx] : undefined}
      >
        {idx !== null && (
          <div className="flex size-full items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIdx(null)}>
            <div className="relative aspect-square w-full max-w-[min(88vh,900px)] overflow-hidden rounded-3xl bg-studio">
              <Image src={images[idx]} alt={t.gallery.items[idx]} fill sizes="90vw" className="object-contain" />
            </div>
            <button onClick={() => setIdx(null)} aria-label={t.gallery.close} className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-white text-char">
              <X className="size-6" />
            </button>
            <button onClick={() => step(-1)} aria-label={t.gallery.prev} className="absolute left-3 grid size-12 place-items-center rounded-full bg-white text-char">
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={() => step(1)} aria-label={t.gallery.next} className="absolute right-3 grid size-12 place-items-center rounded-full bg-white text-char">
              <ChevronRight className="size-6" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
