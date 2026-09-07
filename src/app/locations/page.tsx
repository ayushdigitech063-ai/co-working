import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationCard from "@/components/LocationCard";
import { MapPin, Filter, X, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchLocations(params: { state?: string; city?: string; area?: string }) {
  try {
    const query = new URLSearchParams({ size: "100" });
    if (params.state) query.set("state", params.state);
    if (params.city) query.set("city", params.city);
    if (params.area) query.set("area", params.area);

    const res = await fetch(`${API_BASE_URL}/locations?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) return { content: [] };
    const json = await res.json();
    return json?.data || { content: [] };
  } catch {
    return { content: [] };
  }
}

export default async function LocationsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const sp = await searchParams;
  const state = sp.state || "";
  const city = sp.city || "";
  const area = sp.area || "";

  let data: any = { content: [] };
  try {
    data = await fetchLocations({ state, city, area });
  } catch (err) {
    console.error("Failed to load locations", err);
  }

  const hasActiveFilters = Boolean(state || city || area);

  const availableStates = ["Rajasthan", "Haryana", "Karnataka"];
  const availableCities = ["Jaipur", "Udaipur", "Jodhpur", "Gurugram", "Faridabad", "Panipat", "Bengaluru", "Mysuru", "Mangaluru", "Hubballi"];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* LUXURY HERO BANNER HEADER WITH BACKGROUND IMAGE */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-20 lg:py-24 border-b border-neutral-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-black/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-widest shadow-xl">
              <Sparkles className="w-3.5 h-3.5" /> NATIONWIDE DIRECTORY
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Prime Co-Working Hubs
            </h1>
            <p className="text-stone-200 text-sm sm:text-lg leading-relaxed font-medium text-center max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Explore state-of-the-art office locations across India's top business destinations.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Active Filter Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Active Filters:</span>
              {state && <span className="bg-white px-2.5 py-1 rounded-md border border-amber-200">{state}</span>}
              {city && <span className="bg-white px-2.5 py-1 rounded-md border border-amber-200">{city}</span>}
              {area && <span className="bg-white px-2.5 py-1 rounded-md border border-amber-200">{area}</span>}
            </div>
            <Link href="/locations" className="text-xs font-bold text-amber-700 hover:text-amber-950 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear Filters
            </Link>
          </div>
        )}

        {/* Locations Grid */}
        {data.content && data.content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.content.map((loc: any) => (
              <LocationCard key={loc._id} location={loc} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm font-semibold">No locations found matching your filter criteria.</p>
            <Link href="/locations" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold">
              View All Locations
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
