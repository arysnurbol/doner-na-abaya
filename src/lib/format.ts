/** 2595 → "2 595 ₸" (неразрывные пробелы, одинаково на сервере и клиенте). */
export function formatPrice(n: number): string {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸`;
}

/** "77470308969" → "tel:+77470308969" */
export const telHref = (digits: string) => `tel:+${digits}`;
