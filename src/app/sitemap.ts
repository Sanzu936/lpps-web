import type { MetadataRoute } from "next";
import { LEGAL_COMPLETO, SITE_URL } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...(LEGAL_COMPLETO
      ? ([
          { url: `${SITE_URL}/aviso-legal/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
          { url: `${SITE_URL}/privacidad/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        ] as MetadataRoute.Sitemap)
      : []),
    { url: `${SITE_URL}/cookies/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
