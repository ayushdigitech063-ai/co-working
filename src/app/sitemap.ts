import { MetadataRoute } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nexushub.co.in";

function toSlug(str: string): string {
  if (!str) return "";

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/workspaces`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/investor-relations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/workspaces/type/dedicated-desk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/workspaces/type/private-cabin`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/workspaces/type/hot-desk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/workspaces/type/meeting-room`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/workspaces/type/virtual-office`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // If API URL is not configured, return static sitemap only.
  if (!API_BASE_URL) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not configured. Generating static sitemap only."
    );

    return staticRoutes;
  }

  let dynamicWorkspaces: MetadataRoute.Sitemap = [];
  let dynamicLocations: MetadataRoute.Sitemap = [];

  try {
    const [workRes, locRes] = await Promise.all([
      fetch(`${API_BASE_URL}/workspaces?limit=200`, {
        next: { revalidate: 3600 },
      }),

      fetch(`${API_BASE_URL}/locations?limit=200`, {
        next: { revalidate: 3600 },
      }),
    ]);

    // Workspaces
    if (workRes.ok) {
      const workData = await workRes.json();

      const workspacesList =
        workData?.data?.content ||
        workData?.content ||
        [];

      dynamicWorkspaces = workspacesList
        .filter((ws: any) => ws?.name || ws?.slug)
        .map((ws: any) => {
          const slug = ws.slug || toSlug(ws.name);

          return {
            url: `${SITE_URL}/workspaces/${slug}`,
            lastModified: ws.updatedAt
              ? new Date(ws.updatedAt)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          };
        });
    } else {
      console.warn(
        `Workspace sitemap API returned ${workRes.status}`
      );
    }

    // Locations
    if (locRes.ok) {
      const locData = await locRes.json();

      const locationsList =
        locData?.data?.content ||
        locData?.content ||
        [];

      const locUrls = new Set<string>();

      locationsList.forEach((loc: any) => {
        const st = toSlug(loc.state || "");
        const ct = toSlug(loc.city || "");
        const ar = toSlug(loc.area || loc.name || "");

        if (st) {
          locUrls.add(`${SITE_URL}/locations/${st}`);
        }

        if (st && ct) {
          locUrls.add(`${SITE_URL}/locations/${st}/${ct}`);
        }

        if (st && ct && ar) {
          locUrls.add(
            `${SITE_URL}/locations/${st}/${ct}/${ar}`
          );
        }
      });

      dynamicLocations = Array.from(locUrls).map((url) => ({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    } else {
      console.warn(
        `Location sitemap API returned ${locRes.status}`
      );
    }
  } catch (err) {
    console.warn(
      "Sitemap dynamic data fetch failed. Using static sitemap:",
      err
    );
  }

  return [
    ...staticRoutes,
    ...dynamicLocations,
    ...dynamicWorkspaces,
  ];
}