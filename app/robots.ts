import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/mypage/"] },
    sitemap: "https://aiskill-market.com/sitemap.xml",
  };
}
