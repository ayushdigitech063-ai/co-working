import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkspaceCard from "@/components/WorkspaceCard";
import WorkspacesFilterView from "@/components/WorkspacesFilterView";
import { WorkspaceType } from "@/types";
import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchLocationById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/locations/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function fetchWorkspaces(params: {
  page?: number;
  size?: number;
  typeId?: string;
  search?: string;
  state?: string;
  city?: string;
  area?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params.size) query.set("size", String(params.size));
    if (params.page) query.set("page", String(params.page));
    if (params.typeId) query.set("typeId", params.typeId);
    if (params.search) query.set("search", params.search);
    if (params.state) query.set("state", params.state);
    if (params.city) query.set("city", params.city);
    if (params.area) query.set("area", params.area);

    const res = await fetch(`${API_BASE_URL}/workspaces?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) return { content: [], totalPages: 0, totalElements: 0, number: 0 };
    const json = await res.json();
    return json?.data || { content: [], totalPages: 0, totalElements: 0, number: 0 };
  } catch {
    return { content: [], totalPages: 0, totalElements: 0, number: 0 };
  }
}

async function fetchWorkspaceTypes(): Promise<WorkspaceType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/workspace-types`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

async function fetchAllLocations() {
  try {
    const res = await fetch(`${API_BASE_URL}/locations?size=100`, { cache: "no-store" });
    if (!res.ok) return { content: [] };
    const json = await res.json();
    return json?.data || { content: [] };
  } catch {
    return { content: [] };
  }
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
}

// Helper to convert slug string back to capitalized words for search regex
function capitalizeSlug(slugStr: string) {
  if (!slugStr) return "";
  return slugStr
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function LocationCatchAllPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  // Case A: Single MongoDB ObjectId or exact ID (e.g. /locations/6862a9c3...)
  if (slug.length === 1 && slug[0].length === 24 && /^[0-9a-fA-F]{24}$/.test(slug[0])) {
    const singleLocId = slug[0];
    const location = await fetchLocationById(singleLocId);

    if (!location) notFound();

    const wsData = await fetchWorkspaces({
      size: 50,
      state: location.state,
      city: location.city,
    });
    const workspaces = wsData.content || [];

    const stateName = location.state || "Rajasthan";
    const cityName = location.city || "Jaipur";
    const areaName = location.area || location.name;

    return (
      <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
        <Navbar />

        {/* LUXURY HERO BANNER WITH BACKGROUND IMAGE */}
        <section className="relative bg-neutral-950 text-white overflow-hidden py-10 sm:py-20 lg:py-24 border-b border-neutral-800">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('${location.imageUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80"}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-black/20" />

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4 flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-neutral-900/80 sm:bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono font-bold shadow-xl">
                <span>{stateName}</span> <span className="text-amber-500">&bull;</span> <span>{cityName}</span> <span className="text-amber-500">&bull;</span> <span className="text-white">{areaName}</span>
              </div>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] px-1">
                {location.name}
              </h1>
              <p className="text-stone-200 text-xs sm:text-base leading-relaxed font-medium text-center flex items-center justify-center gap-1.5 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>{location.address}</span>
              </p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 font-mono">
                EXECUTIVE HUB SPECS
              </span>
              <h2 className="text-2xl font-serif font-bold text-neutral-950">
                Corporate Office Infrastructure in {areaName}
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {location.description || `State-of-the-art office infrastructure with gigabit fiber connectivity, soundproof meeting rooms, 24/7 security access, and premium corporate amenities.`}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-stone-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-400 font-semibold block">State</span>
                  <span className="font-bold text-neutral-900">{stateName}</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-400 font-semibold block">City</span>
                  <span className="font-bold text-neutral-900">{cityName}</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-400 font-semibold block">Business Zone</span>
                  <span className="font-bold text-neutral-900">{areaName}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
              <img
                src={location.imageUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-neutral-950">
                Offices &amp; Workspaces Available in {areaName}
              </h2>
              <Link href="/workspaces" className="text-xs font-bold text-amber-600 hover:underline">
                View All Workspaces &rarr;
              </Link>
            </div>

            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workspaces.map((ws: any) => (
                  <WorkspaceCard key={ws._id} workspace={ws} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm">
                <p className="text-neutral-500 text-sm">No active workspaces listed for this exact area right now.</p>
                <Link href="/workspaces" className="inline-block mt-4 px-6 py-3 rounded-xl bg-neutral-950 text-white text-xs font-bold">
                  Browse All Available Offices
                </Link>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Case B: Dynamic SEO Hierarchy Route (/locations/[state]/[city]/[area])
  const rawState = slug[0] || "";
  const rawCity = slug[1] || "";
  const rawArea = slug[2] || "";

  const state = capitalizeSlug(rawState);
  const city = capitalizeSlug(rawCity);
  const area = capitalizeSlug(rawArea);

  const page = Number(sp.page) || 1;
  const typeId = sp.typeId || "";
  const search = sp.search || "";

  let data: any = { content: [], totalPages: 0, totalElements: 0, number: 0 };
  let types: WorkspaceType[] = [];
  let allLocations: any[] = [];

  try {
    const [locRes, wsData, typeList] = await Promise.all([
      fetchAllLocations(),
      fetchWorkspaces({
        page,
        size: 24,
        typeId,
        search,
        state,
        city,
        area,
      }),
      fetchWorkspaceTypes(),
    ]);

    allLocations = locRes.content || [];
    data = wsData;
    types = typeList;
  } catch (err) {
    console.error("Failed to load SEO location page", err);
  }

  const initialLocName = area || city || state;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* WEWORK-STYLE HERO BANNER HEADER */}
      <section className="relative w-full bg-neutral-950 text-white min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-center items-center z-20 pb-16 sm:pb-20 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt="Workspace Directory"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />
        </div>

        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12 lg:pt-14 flex flex-col items-center">
          <div className="max-w-3xl space-y-3 sm:space-y-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> NATIONWIDE DIRECTORY
            </span>
            <h1 id="hero-title" className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {area ? `${area} Co-Working Workspaces` : city ? `${city} Co-Working Workspaces` : state ? `${state} Co-Working Hubs` : "Browse Prime Co-Working Workspaces"}
            </h1>
            <p id="hero-subtitle" className="text-stone-200 text-xs sm:text-base font-semibold leading-relaxed max-w-xl text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {initialLocName
                ? `Explore high-speed workstations, executive private cabins, meeting conference suites, and virtual business addresses in ${initialLocName}.`
                : "Explore high-speed workstations, executive private cabins, meeting conference suites, and virtual business addresses across 50+ premier hubs in India."}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA WITH INSTANT ZERO-RELOAD CLIENT FILTERING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 pb-12 flex-1 w-full">
        <WorkspacesFilterView
          initialWorkspaces={data.content || []}
          initialTotalElements={data.totalElements || 0}
          initialTotalPages={data.totalPages || 0}
          types={types}
          allLocations={allLocations}
          initialState={state}
          initialCity={city}
          initialArea={area}
          initialTypeId={typeId}
          initialSearch={search}
          baseUrl={`/locations/${slug.join("/")}`}
        />
      </div>

      <Footer />
    </div>
  );
}
