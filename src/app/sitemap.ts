import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { ru: `${site.url}/ru`, kk: `${site.url}/kz` };
  return [
    { url: `${site.url}/ru`, changeFrequency: "weekly", priority: 1, alternates: { languages } },
    { url: `${site.url}/kz`, changeFrequency: "weekly", priority: 0.9, alternates: { languages } },
  ];
}
