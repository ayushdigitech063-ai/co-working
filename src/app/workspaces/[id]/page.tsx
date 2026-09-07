import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import WorkspaceCard from "@/components/WorkspaceCard";
import FaqAccordion from "@/components/FaqAccordion";
import { Workspace, WorkspaceType, Location } from "@/types";
import {
  Users, MapPin, CheckCircle, Star, Building2, Image as ImageIcon, Sparkles, ShieldCheck, Coffee, Wifi, AirVent, Printer, PhoneCall, Zap, Lock, HelpCircle, ChevronDown, ArrowRight
} from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchWorkspaceById(id: string): Promise<Workspace | null> {
  if (!id) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/workspaces/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function fetchWorkspaceReviews(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/workspace/${id}`, { cache: "no-store" });
    if (!res.ok) return { reviews: [], averageRating: 0, totalReviews: 0 };
    const json = await res.json();
    return json?.data || { reviews: [], averageRating: 0, totalReviews: 0 };
  } catch {
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}

async function fetchNearbyWorkspaces(state: string): Promise<Workspace[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/workspaces?state=${encodeURIComponent(state)}&size=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.content || [];
  } catch {
    return [];
  }
}

interface PageProps { params: Promise<{ id: string }> }

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const DEFAULT_INTERIOR_VIEWS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
];

const INTERIOR_LABELS = [
  "Main Featured View",
  "Executive Conference Room",
  "Lounge & Cafeteria",
  "Private Cabin Suite",
  "Reception & Lobby",
  "Soundproof Phone Booth",
];

const FAQS = [
  {
    q: "What is included in the monthly workspace rental price?",
    a: "Monthly pricing includes high-speed gigabit Wi-Fi, air conditioning, unlimited gourmet tea/coffee, reception guest management, IT infrastructure support, and daily professional housekeeping.",
  },
  {
    q: "Can I schedule a physical tour before making a booking?",
    a: "Absolutely! You can submit a booking query or call our dedicated helpline at 1800 123 77888 to schedule a walkthrough tour with our Community Manager.",
  },
  {
    q: "What are the operating hours for members?",
    a: "All NexusHub co-working members get 24/7 round-the-clock smart keycard biometric access to their dedicated workstations and private cabins.",
  },
  {
    q: "Are contract terms and security deposits flexible?",
    a: "Yes, we offer flexible month-to-month contracts as well as custom long-term enterprise agreements with fully refundable security deposits.",
  },
];

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  let workspace: Workspace | null = null;
  let reviews: any = { reviews: [], averageRating: 0, totalReviews: 0 };
  let nearbyWorkspaces: Workspace[] = [];

  try {
    [workspace, reviews] = await Promise.all([
      fetchWorkspaceById(id),
      fetchWorkspaceReviews(id),
    ]);

    if (workspace) {
      const locObj = typeof workspace.location === "object" ? (workspace.location as Location) : null;
      const stateToSearch = locObj?.state || "Rajasthan";
      const nearbyContent = await fetchNearbyWorkspaces(stateToSearch);
      nearbyWorkspaces = nearbyContent.filter((w) => w._id !== workspace?._id).slice(0, 3);
    }
  } catch {
    notFound();
  }

  if (!workspace) notFound();

  const typeName =
    workspace.workspaceType && typeof workspace.workspaceType === "object"
      ? (workspace.workspaceType as WorkspaceType).name || "Private Office"
      : workspace.workspaceType || "Private Office";

  const location =
    workspace.location && typeof workspace.location === "object"
      ? (workspace.location as Location)
      : null;

  const title = workspace.title || "Executive Co-Working Workspace";
  const address = location?.address || workspace.address || "Prime Business Hub";
  const areaName = location?.area || location?.name || "Business District";
  const cityName = location?.city || "Jaipur";
  const stateName = location?.state || "Rajasthan";

  const images =
    workspace.images && workspace.images.length > 0
      ? workspace.images
      : DEFAULT_INTERIOR_VIEWS;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span>/</span>
          <Link href="/workspaces" className="hover:text-neutral-900">Workspaces</Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold truncate max-w-xs">{title}</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                {typeName}
              </span>
              {workspace.isPopular && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  🔥 POPULAR
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-neutral-950 tracking-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{address}, {cityName}, {stateName}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm shrink-0">
            <div>
              <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-mono">Starting From</div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-950">
                {formatCurrency(workspace.price)}
                <span className="text-xs font-normal text-neutral-500"> / month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-72 sm:h-96 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
            <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="h-34 sm:h-44 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                <img src={img} alt={`${title} view ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Details & Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-neutral-950">Workspace Overview</h2>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
                {workspace.description || "State-of-the-art office workspace designed for professionals and corporate teams. Includes high-speed internet, premium ergonomic seating, meeting access, and 24/7 security."}
              </p>
            </div>

            {/* Specs & Amenities */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-neutral-950">Key Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-neutral-800">
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><Wifi className="w-4 h-4 text-amber-600" /> High Speed Wi-Fi</div>
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><AirVent className="w-4 h-4 text-amber-600" /> Air Conditioned</div>
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><Coffee className="w-4 h-4 text-amber-600" /> Unlimited Coffee/Tea</div>
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><Printer className="w-4 h-4 text-amber-600" /> Printing & Scanning</div>
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><Lock className="w-4 h-4 text-amber-600" /> 24/7 Biometric Access</div>
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-neutral-100"><Users className="w-4 h-4 text-amber-600" /> Conference Rooms</div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
              <h2 className="text-xl font-serif font-bold text-neutral-950">Frequently Asked Questions</h2>
              <FaqAccordion items={FAQS} />
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-neutral-200 shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Schedule a Tour / Book</h3>
                <p className="text-xs text-neutral-500 mt-1">Get instant assistance & exclusive discounts</p>
              </div>
              <BookingForm workspaceId={workspace._id} workspaceTitle={title} price={workspace.price} />
            </div>
          </div>
        </div>

        {/* Nearby Workspaces */}
        {nearbyWorkspaces.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-serif font-bold text-neutral-950">Similar Workspaces in {stateName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyWorkspaces.map((ws) => (
                <WorkspaceCard key={ws._id} workspace={ws} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
