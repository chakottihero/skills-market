import { MetadataRoute } from "next";

const SITE_URL = "https://aiskill-market.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                       lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/skills`,           lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/sell`,             lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
    { url: `${SITE_URL}/categories`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/about`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/terms`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/legal`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
