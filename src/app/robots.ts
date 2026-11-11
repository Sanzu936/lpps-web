import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Las webs de muestra son negocios inventados: se pueden visitar, pero no se indexan.
    rules: { userAgent: "*", allow: "/", disallow: ["/trabajos/sigila/", "/trabajos/oquedad/", "/trabajos/candela/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
