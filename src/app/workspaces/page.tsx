import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkspacesFilterView from "@/components/WorkspacesFilterView";
import { WorkspaceType } from "@/types";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchWorkspaces(params: any) {
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

export default async function WorkspacesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const typeId = sp.typeId || "";
  const search = sp.search || "";
  const state = sp.state || "";
  const city = sp.city || "";
  const area = sp.area || "";

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
    console.error("Failed to load workspaces page", err);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* WEWORK-STYLE HERO BANNER HEADER */}
      <section className="relative w-full bg-neutral-950 text-white min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-center items-center z-20 pb-16 sm:pb-20 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Workspace Directory"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />
        </div>

        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12 lg:pt-14 flex flex-col items-center">
          <div className="max-w-3xl space-y-3 sm:space-y-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ALL WORKSPACES
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15] text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Find Your Ideal Co-Working Space
            </h1>
            <p className="text-stone-200 text-xs sm:text-base font-semibold leading-relaxed max-w-xl text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Browse dedicated desks, private cabins, virtual offices, and managed office floors across top business hubs.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER VIEW */}
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
          baseUrl="/workspaces"
        />
      </div>

      <Footer />
    </div>
  );
}
