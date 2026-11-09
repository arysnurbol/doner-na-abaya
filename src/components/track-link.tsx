"use client";

import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Внешняя ссылка с событием аналитики (телефон, WhatsApp, карты). */
export function TrackLink({
  event,
  where,
  external = true,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: AnalyticsEvent; where: string; external?: boolean }) {
  return (
    <a
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        track(event, { location: where });
        props.onClick?.(e);
      }}
    />
  );
}
