import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkspaceCard from "@/components/WorkspaceCard";
import { locationService, workspaceService } from "@/services/workspaceService";
import { MapPin, Navigation, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
interface PageProps { params: Promise<{ id: string }> }

export default async function LocationDetailPage({ params }: PageProps) {
  const { id } = await params;
  let location: any = null;
  let workspaces: any[] = [];

  try {
    location = await locationService.getLocationById(id);
    const wsData = await workspaceService.getWorkspaces({
      size: 50,
      state: location.state,
      city: location.city,
    });
    workspaces = wsData.content || [];
  } catch {
    notFound();
  }

  if (!location) notFound();

  const stateName = location.state || "Rajasthan";
  const cityName = location.city || "Jaipur";
  const areaName = location.area || location.name;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      {/* LUXURY HERO BANNER WITH BACKGROUND IMAGE */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-20 lg:py-24 border-b border-neutral-800">
        {/* Prime Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${location.imageUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80"}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-xl">
              <span>{stateName}</span> &bull; <span>{cityName}</span> &bull; <span className="text-white">{areaName}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {location.name}
            </h1>
            <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-medium text-center flex items-center justify-center gap-2 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              {location.address}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* LOCATION OVERVIEW CARD */}
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

        {/* WORKSPACES LISTING IN THIS LOCATION */}
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
