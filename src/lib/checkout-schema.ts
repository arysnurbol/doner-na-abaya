/**
 * Валидация формы заказа. Отдельный модуль: Zod грузится только когда гость
 * открывает оформление, а не вместе со страницей.
 */
import { z } from "zod";
import type { Dict } from "@/i18n/ru";
import { clean, normalizePhone, type CheckoutData } from "./order";

export function checkoutSchema(t: Dict["checkout"]["errors"]) {
  return z
    .object({
      name: z.string().transform((v) => clean(v, 60)).pipe(z.string().min(2, t.name)),
      phone: z
        .string()
        .transform((v, ctx) => {
          const n = normalizePhone(v);
          if (!n) {
            ctx.addIssue({ code: "custom", message: t.phone });
            return z.NEVER;
          }
          return n;
        }),
      type: z.enum(["pickup", "delivery"]),
      address: z.string().transform((v) => clean(v, 200)),
      comment: z.string().transform((v) => clean(v, 300)),
    })
    .superRefine((v, ctx) => {
      if (v.type === "delivery" && v.address.length < 5) {
        ctx.addIssue({ code: "custom", path: ["address"], message: t.address });
      }
    });
}

export type { CheckoutData };
