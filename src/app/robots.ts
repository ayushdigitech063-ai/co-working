import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexushub.co.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/superadmin/", "/api/", "/login", "/register", "/my-bookings"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
