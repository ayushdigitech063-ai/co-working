import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkspacesFilterView from "@/components/WorkspacesFilterView";
import { WorkspaceType } from "@/types";
import { Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

async function fetchWorkspaces(params: {
  typeId?: string;
  state?: string;
  city?: string;
  area?: string;
  search?: string;
  page?: number;
  size?: number;
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
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default async function WorkspaceTypePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const page = Number(sp.page) || 1;
  const state = sp.state || "";
  const city = sp.city || "";
  const area = sp.area || "";
  const search = sp.search || "";

  let types: WorkspaceType[] = [];
  let matchedType: WorkspaceType | null = null;
  let data: any = { content: [], totalPages: 0, totalElements: 0, number: 0 };
  let allLocations: any[] = [];

  try {
    const [locRes, typeList] = await Promise.all([
      fetchAllLocations(),
      fetchWorkspaceTypes(),
    ]);

    allLocations = locRes.content || [];
    types = typeList;

    matchedType = types.find(
      (t) => toSlug(t.name) === slug || t._id === slug
    ) || null;

    if (matchedType) {
      data = await fetchWorkspaces({
        typeId: matchedType._id,
        state,
        city,
        area,
        search,
        page,
        size: 24,
      });
    }
  } catch (err) {
    console.error("Failed to fetch workspace types", err);
  }

  if (!matchedType) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* WEWORK-STYLE HERO BANNER HEADER */}
      <section className="relative w-full bg-neutral-950 text-white min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-center items-center z-20 pb-16 sm:pb-20 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80"
            alt="Workspace Category"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />
        </div>

        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12 lg:pt-14 flex flex-col items-center">
          <div className="max-w-3xl space-y-3 sm:space-y-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> WORKSPACE CATEGORY
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {matchedType.name}
            </h1>
            <p className="text-stone-200 text-xs sm:text-base font-semibold leading-relaxed max-w-xl text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {matchedType.description || `Browse top rated ${matchedType.name} plans across premier business hubs.`}
            </p>
          </div>
        </div>
      </section>

      {/* FILTER TOOLBAR & WORKSPACES VIEW */}
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
          initialTypeId={matchedType._id}
          initialSearch={search}
          baseUrl={`/workspaces/type/${slug}`}
        />
      </div>

      <Footer />
    </div>
  );
}
