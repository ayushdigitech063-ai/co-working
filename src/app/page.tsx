import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchHomeData() {
  try {
    const [wsRes, locRes, typeRes, settingsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/workspaces?size=10`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/locations?size=50`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/workspace-types`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/settings`, { cache: "no-store" }),
    ]);

    const wsData = wsRes.ok ? await wsRes.json() : { data: { content: [] } };
    const locData = locRes.ok ? await locRes.json() : { data: { content: [] } };
    const typeData = typeRes.ok ? await typeRes.json() : { data: [] };
    const settingsData = settingsRes.ok ? await settingsRes.json() : { data: {} };

    return {
      workspaces: wsData?.data?.content || [],
      locations: locData?.data?.content || [],
      types: typeData?.data || [],
      cmsSettings: settingsData?.data || {},
    };
  } catch (err) {
    console.error("Failed to fetch home data", err);
    return { workspaces: [], locations: [], types: [], cmsSettings: {} };
  }
}

export default async function HomePage() {
  const { workspaces, locations, types, cmsSettings } = await fetchHomeData();

  return (
    <HomeContent
      initialWorkspaces={workspaces}
      initialLocations={locations}
      initialTypes={types}
      cmsSettings={cmsSettings}
    />
  );
}
