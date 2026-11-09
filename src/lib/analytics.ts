import { site } from "@/config/site";

export type AnalyticsEvent =
  | "menu_view"
  | "product_click"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "whatsapp_click"
  | "order_submit"
  | "map_click"
  | "phone_click";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Отправляет событие в GA4 и Яндекс Метрику, если они подключены и пользователь дал согласие.
 * Без ID счётчиков вызов ничего не делает. page_view отправляют сами счётчики.
 */
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  if (site.analytics.yandexMetrica) {
    window.ym?.(Number(site.analytics.yandexMetrica), "reachGoal", event, params);
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}
