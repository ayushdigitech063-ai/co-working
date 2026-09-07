"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkspaceCard from "@/components/WorkspaceCard";
import LocationCard from "@/components/LocationCard";
import BookTourModal from "@/components/BookTourModal";
import ListYourSpaceModal from "@/components/ListYourSpaceModal";
import {
  Wifi, MapPin, Clock, Users, Coffee, ShieldCheck,
  Play, Search, ChevronDown, Calendar, LayoutGrid,
  ArrowRight, UserCheck, Globe, Star, Heart, Building, CheckCircle2, Check,
  Printer, PhoneCall, Dumbbell, Sparkles, HelpCircle, ChevronUp, PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HomeContentProps {
  workspaces?: any[];
  locations?: any[];
  types?: any[];
  initialWorkspaces?: any[];
  initialLocations?: any[];
  initialTypes?: any[];
  cmsSettings?: any;
}

const CATEGORY_CARDS = [
  {
    title: "Hot Desk",
    subtitle: "Flexible seating for individuals",
    image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=600&q=80",
    icon: Users,
    href: "/workspaces?type=hot-desk",
  },
  {
    title: "Dedicated Desk",
    subtitle: "Your own desk, all day",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80",
    icon: MapPin,
    href: "/workspaces?type=dedicated-desk",
  },
  {
    title: "Private Office",
    subtitle: "Fully furnished private spaces",
    image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&w=600&q=80",
    icon: Building,
    href: "/workspaces?type=private-cabin",
  },
  {
    title: "Meeting Rooms",
    subtitle: "Book by the hour",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80",
    icon: Users,
    href: "/workspaces?type=meeting-room",
  },
  {
    title: "Virtual Office",
    subtitle: "Establish your business presence",
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=600&q=80",
    icon: Globe,
    href: "/workspaces?type=virtual-office",
  },
];

const STATS_DATA = [
  { value: "300+", label: "Locations", sublabel: "Across India", icon: Building },
  { value: "2M+", label: "Members", sublabel: "And growing", icon: UserCheck },
  { value: "100+", label: "Cities", sublabel: "To work in", icon: Globe },
  { value: "10+", label: "Years of trust", sublabel: "In India", icon: Star },
  { value: "98%", label: "Member satisfaction", sublabel: "Rate", icon: Heart },
];

const AMENITIES_LIST = [
  { name: "Gigabit Fiber WiFi", desc: "Redundant high-speed internet with 99.9% uptime SLA.", icon: Wifi },
  { name: "Artisanal Coffee & Tea", desc: "Unlimited micro-roasted coffee and organic teas.", icon: Coffee },
  { name: "Soundproof Phone Booths", desc: "Private pods for confidential calls & video chats.", icon: PhoneCall },
  { name: "Print & Scan Hub", desc: "Enterprise color printers & paper shredding stations.", icon: Printer },
  { name: "Wellness & Prayer Rooms", desc: "Quiet meditation & mother's rooms for rejuvenation.", icon: Dumbbell },
  { name: "Event & Community Hub", desc: "Weekly networking mixers, investor talks & workshops.", icon: Sparkles },
  { name: "24/7 Biometric Access", desc: "CCTV security & round-the-clock desk access.", icon: Clock },
  { name: "Concierge & Mail Service", desc: "Front desk reception and daily mail management.", icon: ShieldCheck },
];

const FAQS_LIST = [
  {
    q: "How does the 20% OFF first month discount work?",
    a: "When you book any Hot Desk, Dedicated Desk, or Private Office for a minimum of 1 month, 20% discount is automatically applied during tour confirmation.",
  },
  {
    q: "Can I upgrade from a Hot Desk to a Private Cabin later?",
    a: "Yes! NexusHub offers seamless flexibility. You can upgrade or add extra desks to your workspace plan at any time with 0 downtime.",
  },
  {
    q: "What is included in the Virtual Office package?",
    a: "Virtual Office includes a prime business address for GST & ROC registration, daily mail receiving/scanning, and 3 complimentary days of Hot Desk access each month.",
  },
  {
    q: "How do I book a private meeting room?",
    a: "Meeting rooms can be booked on demand through your NexusHub member dashboard by the hour or full day, equipped with 4K screens & video conferencing.",
  },
];

const TOP_CITIES = [
  {
    name: "Gurugram",
    hubs: "8 Centres",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    area: "DLF Cyber City, Golf Course Road",
  },
  {
    name: "Bengaluru",
    hubs: "12 Centres",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    area: "Marathahalli, Indiranagar, HSR",
  },
  {
    name: "Mumbai",
    hubs: "10 Centres",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    area: "BKC, Lower Parel, Andheri",
  },
  {
    name: "Hyderabad",
    hubs: "6 Centres",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    area: "HITEC City, Madhapur",
  },
];

const TESTIMONIALS = [
  {
    quote: "NexusHub transformed how our 40-person team operates. The flexibility and premium amenities are unmatched in India.",
    author: "Ananya Sharma",
    role: "VP of Product, TechScale",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Gurugram",
    rating: 5,
  },
  {
    quote: "Moving to NexusHub BKC gave our financial consultancy the prestigious address and private cabin setup we needed.",
    author: "Vikram Malhotra",
    role: "Managing Director, Apex Capital",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Mumbai",
    rating: 5,
  },
  {
    quote: "The community events and hot desk facilities in Cyber City are incredible. Best networking hub for founders.",
    author: "Rohan Gupta",
    role: "Founder, DevPulse",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    location: "Bengaluru",
    rating: 5,
  },
];

export default function HomeContent({
  initialWorkspaces = [],
  initialLocations = [],
  initialTypes = [],
  workspaces: legacyWorkspaces,
  locations: legacyLocations,
  types: legacyTypes,
  cmsSettings = {},
}: HomeContentProps) {
  const workspaces = initialWorkspaces.length > 0 ? initialWorkspaces : (legacyWorkspaces || []);
  const locations = initialLocations.length > 0 ? initialLocations : (legacyLocations || []);
  const types = initialTypes.length > 0 ? initialTypes : (legacyTypes || []);

  const heroData = cmsSettings?.cms_hero || {};
  const traditionalData = cmsSettings?.cms_traditional || {};
  const galleryData = cmsSettings?.cms_gallery || {};
  const plansData = cmsSettings?.cms_plans || {};
  const audienceData = cmsSettings?.cms_audience || {};
  const router = useRouter();
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isListSpaceModalOpen, setIsListSpaceModalOpen] = useState(false);

  // Search Bar Custom 4-Filter Dropdowns State (State, City, Area, Type)
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState<any>(null);

  const [stateDropOpen, setStateDropOpen] = useState(false);
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [areaDropOpen, setAreaDropOpen] = useState(false);
  const [typeDropOpen, setTypeDropOpen] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [enterpriseSlide, setEnterpriseSlide] = useState(0);
  const [reviewSlide, setReviewSlide] = useState(0);

  // Auto-slider for Enterprise Solutions (every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setEnterpriseSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slider for Review Cards (every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setStateDropOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropOpen(false);
      }
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setAreaDropOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock background body scroll when Modal is open
  useEffect(() => {
    if (isTourModalOpen || isListSpaceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTourModalOpen, isListSpaceModalOpen]);

  // Scroll reveal IntersectionObserver for homepage sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (selectedState && selectedCity && selectedArea) {
      router.push(`/locations/${toSlug(selectedState)}/${toSlug(selectedCity)}/${toSlug(selectedArea)}`);
      return;
    }
    if (selectedState && selectedCity) {
      router.push(`/locations/${toSlug(selectedState)}/${toSlug(selectedCity)}`);
      return;
    }
    if (selectedState) {
      router.push(`/locations/${toSlug(selectedState)}`);
      return;
    }
    if (selectedType) {
      router.push(`/workspaces/type/${toSlug(selectedType.name)}`);
      return;
    }
    router.push(`/workspaces`);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Top Banner Announcement */}
      <div className="bg-neutral-950 text-white py-2 px-3 sm:px-6 text-xs font-medium text-center flex items-center justify-between gap-2 max-w-full z-30">
        <div className="flex-1 text-center truncate sm:whitespace-normal">
          ✨ <span className="font-semibold">Special Offer:</span> Get <span className="text-amber-400 font-extrabold">20% OFF</span> on your first month! <span className="hidden sm:inline text-neutral-400">Limited time only.</span>
        </div>
        <button
          onClick={() => setIsTourModalOpen(true)}
          className="px-3 py-1 rounded-full border border-white/30 text-[11px] font-bold hover:bg-white hover:text-black transition-colors shrink-0"
        >
          Book a Tour
        </button>
      </div>

      <Navbar />

      {/* WEWORK-STYLE HERO BANNER */}
      <section className="relative w-full bg-stone-100 min-h-[480px] sm:min-h-[540px] lg:min-h-[620px] xl:min-h-[660px] flex flex-col justify-center z-20 pb-16 sm:pb-24 lg:pb-28">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-bg.png"
            alt="WeWork Modern Workspace"
            className="w-full h-full object-cover object-center"
          />
          {/* Natural subtle white overlay blending across left-to-right without sharp edge cut */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-9/12 lg:w-7/12 pointer-events-none" />
        </div>

        <div className="max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-14 lg:pt-18">
          <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-5 animate-slide-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-neutral-950 tracking-tight leading-[1.15]">
              {heroData.titleLine1 || "Work Better."}<br className="hidden sm:inline" /> {heroData.titleLine2 || "Together."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-700 font-medium leading-relaxed max-w-lg">
              {heroData.subtitle || "Premium flexible workspaces, inspiring environments and a global community to help your business thrive."}
            </p>

            {/* HERO CTA BUTTONS: Equal height, side-by-side on mobile without overflow */}
            <div className="flex items-center gap-3 pt-2 max-w-md">
              <Link
                href="/workspaces"
                className="flex-1 h-[48px] px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-neutral-950 hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center text-center hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                Find Workspace
              </Link>
              <button
                type="button"
                onClick={() => setIsListSpaceModalOpen(true)}
                className="flex-1 h-[48px] px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 transition-all flex items-center justify-center gap-1.5 shadow-sm border border-amber-400/80 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-neutral-950 shrink-0" />
                <span>List Your Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* OVERLAPPING SEARCH / EXPLORE CARD: Clean 2x2 grid on mobile, 1 row on desktop */}
        <div className="absolute left-0 right-0 -bottom-10 sm:-bottom-12 z-30 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08)] border border-neutral-200/80 grid grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            {/* 1. STATE */}
            <div ref={stateRef} className="col-span-1 lg:col-span-3 relative p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-neutral-100 hover:border-amber-400/50 transition-colors">
              <div
                onClick={() => {
                  setStateDropOpen(!stateDropOpen);
                  setCityDropOpen(false);
                  setAreaDropOpen(false);
                  setTypeDropOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="w-full min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block cursor-pointer font-mono">
                    STATE
                  </label>
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mt-0.5">
                    <span className={`truncate ${selectedState ? "text-neutral-950 font-bold" : "text-neutral-400 font-normal"}`}>
                      {selectedState || "All States"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 shrink-0 ${stateDropOpen ? "rotate-180 text-black" : ""}`} />
                  </div>
                </div>
              </div>

              {stateDropOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1 font-mono">
                    Select State
                  </div>
                  <div
                    onClick={() => { setSelectedState(""); setStateDropOpen(false); }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-100 text-neutral-600"
                  >
                    All States
                  </div>
                  {Array.from(new Set((locations || []).map((l: any) => l.state || "Rajasthan").filter(Boolean))).map((st: any) => (
                    <div
                      key={st}
                      onClick={() => {
                        setSelectedState(st);
                        setSelectedCity("");
                        setSelectedArea("");
                        setStateDropOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${selectedState === st ? "bg-amber-50 text-amber-700" : "text-neutral-800 hover:bg-stone-100"}`}
                    >
                      <span>{st}</span>
                      {selectedState === st && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. CITY */}
            <div ref={cityRef} className="col-span-1 lg:col-span-3 relative p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-neutral-100 hover:border-amber-400/50 transition-colors">
              <div
                onClick={() => {
                  setCityDropOpen(!cityDropOpen);
                  setStateDropOpen(false);
                  setAreaDropOpen(false);
                  setTypeDropOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <MapPin className="w-4 h-4 text-neutral-600 shrink-0" />
                <div className="w-full min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block cursor-pointer font-mono">
                    CITY
                  </label>
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mt-0.5">
                    <span className={`truncate ${selectedCity ? "text-neutral-950 font-bold" : "text-neutral-400 font-normal"}`}>
                      {selectedCity || "Select City"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 shrink-0 ${cityDropOpen ? "rotate-180 text-black" : ""}`} />
                  </div>
                </div>
              </div>

              {cityDropOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1 font-mono">
                    Select City
                  </div>
                  <div
                    onClick={() => { setSelectedCity(""); setCityDropOpen(false); }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-100 text-neutral-600"
                  >
                    All Cities
                  </div>
                  {Array.from(
                    new Set(
                      (locations || [])
                        .filter((l: any) => !selectedState || (l.state || "Rajasthan") === selectedState)
                        .map((l: any) => l.city || l.name)
                        .filter(Boolean)
                    )
                  ).map((city: any) => (
                    <div
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedArea("");
                        setCityDropOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${selectedCity === city ? "bg-amber-50 text-amber-700" : "text-neutral-800 hover:bg-stone-100"}`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. AREA / LOCALITY */}
            <div ref={areaRef} className="col-span-1 lg:col-span-2 relative p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-neutral-100 hover:border-amber-400/50 transition-colors">
              <div
                onClick={() => {
                  setAreaDropOpen(!areaDropOpen);
                  setStateDropOpen(false);
                  setCityDropOpen(false);
                  setTypeDropOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <div className="w-full min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block cursor-pointer font-mono">
                    AREA / LOCALITY
                  </label>
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mt-0.5">
                    <span className={`truncate ${selectedArea ? "text-neutral-950 font-bold" : "text-neutral-400 font-normal"}`}>
                      {selectedArea || "Area"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 shrink-0 ${areaDropOpen ? "rotate-180 text-black" : ""}`} />
                  </div>
                </div>
              </div>

              {areaDropOpen && (
                <div className="absolute left-0 right-0 sm:right-auto top-full mt-2 w-full sm:w-60 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-60 overflow-y-auto">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1 font-mono">
                    Select Area / Locality
                  </div>
                  <div
                    onClick={() => { setSelectedArea(""); setAreaDropOpen(false); }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-100 text-neutral-600"
                  >
                    All Areas
                  </div>
                  {Array.from(
                    new Set(
                      (locations || [])
                        .filter((l: any) => (!selectedState || (l.state || "Rajasthan") === selectedState) && (!selectedCity || (l.city || l.name) === selectedCity))
                        .map((l: any) => l.area || l.name)
                        .filter(Boolean)
                    )
                  ).map((area: any) => (
                    <div
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setAreaDropOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${selectedArea === area ? "bg-amber-50 text-amber-700" : "text-neutral-800 hover:bg-stone-100"}`}
                    >
                      <span className="truncate">{area}</span>
                      {selectedArea === area && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. WORKSPACE TYPE */}
            <div ref={typeRef} className="col-span-1 lg:col-span-2 relative p-2.5 sm:p-3 rounded-xl bg-stone-50/70 border border-neutral-100 hover:border-amber-400/50 transition-colors">
              <div
                onClick={() => {
                  setTypeDropOpen(!typeDropOpen);
                  setStateDropOpen(false);
                  setCityDropOpen(false);
                  setAreaDropOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <LayoutGrid className="w-4 h-4 text-neutral-600 shrink-0" />
                <div className="w-full min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block cursor-pointer font-mono">
                    TYPE
                  </label>
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mt-0.5">
                    <span className={`truncate ${selectedType ? "text-neutral-950 font-bold" : "text-neutral-400 font-normal"}`}>
                      {selectedType?.name || "Workspace"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 shrink-0 ${typeDropOpen ? "rotate-180 text-black" : ""}`} />
                  </div>
                </div>
              </div>

              {typeDropOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-2xl border border-neutral-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-60 overflow-y-auto">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1 font-mono">
                    Choose Type
                  </div>
                  {types.map((t: any) => (
                    <div
                      key={t._id}
                      onClick={() => {
                        setSelectedType(t);
                        setTypeDropOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${selectedType?._id === t._id ? "bg-amber-50 text-amber-700 font-bold" : "text-neutral-800 hover:bg-stone-100"}`}
                    >
                      <span>{t.name}</span>
                      {selectedType?._id === t._id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EXPLORE SPACES BUTTON: Full width on mobile grid, spans 2 cols on desktop */}
            <div className="col-span-2 lg:col-span-2 mt-1 sm:mt-0">
              <button
                type="submit"
                className="w-full h-[46px] rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Explore Spaces</span>
              </button>
            </div>
          </form>
        </div>

        {/* ENLARGED PROMINENT RIGHT SIDE FLOATING BUTTON */}
        <button
          onClick={() => setIsTourModalOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-neutral-950 hover:bg-neutral-800 text-white px-3 sm:px-3.5 py-4 sm:py-5 rounded-l-2xl flex flex-col items-center gap-3 shadow-2xl group transition-all hover:scale-105 border-l border-y border-neutral-800"
        >
          <Calendar className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-xs sm:text-sm font-extrabold tracking-widest uppercase text-white font-mono">
            Book a tour
          </span>
        </button>
      </section>

      {/* WORKSPACE SOLUTIONS SECTION */}
      <section className="pt-20 sm:pt-24 pb-16 bg-stone-50/50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 relative scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-mono">
              FIND YOUR PERFECT SPACE
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              Workspace Solutions <span className="text-brand-yellow font-extrabold">for Every Need</span>
            </h2>
            <Link
              href="/workspaces"
              className="md:absolute right-0 top-4 inline-flex items-center text-xs font-bold text-neutral-800 hover:text-brand-yellow transition-colors mt-3 md:mt-0"
            >
              View all spaces <ArrowRight className="w-3.5 h-3.5 ml-1 text-brand-yellow" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
            {(types && types.length > 0 ? types : CATEGORY_CARDS).slice(0, 5).map((cat: any, idx: number) => {
              const title = cat.name || cat.title || "Workspace Category";
              const subtitle = cat.description || cat.subtitle || "Flexible seating and private spaces.";
              const image = cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
              const typeId = cat._id;
              const href = typeId ? `/workspaces?typeId=${typeId}` : "/workspaces";

              return (
                <Link
                  key={typeId || idx}
                  href={href}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                  className="scroll-reveal-scale group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-stone-100">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-4 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                        <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                      </div>
                    </div>

                    <div className="p-3 sm:p-5">
                      <h3 className="font-bold text-neutral-900 text-sm sm:text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-neutral-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 font-normal line-clamp-2">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                    <span className="inline-flex items-center text-[11px] sm:text-xs font-bold text-amber-600 group-hover:translate-x-1.5 transition-transform">
                      Explore <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* STATS BANNER CARD (DYNAMICALLY CALCULATED FROM LIVE DB DATA) */}
          {(() => {
            const liveLocationsCount = locations?.length > 0 ? locations.length : 300;
            const liveCitiesCount = new Set((locations || []).map((l: any) => l.city || l.name).filter(Boolean)).size || 100;
            const liveWorkspacesCount = workspaces?.length > 0 ? workspaces.length : 50;

            const DYNAMIC_STATS = [
              { value: `${liveLocationsCount}+`, label: "Locations & Hubs", sublabel: "Across India", icon: Building },
              { value: `${liveCitiesCount}+`, label: "Cities", sublabel: "Prime hubs", icon: Globe },
              { value: `${liveWorkspacesCount}+`, label: "Workspaces", sublabel: "Ready to move in", icon: LayoutGrid },
              { value: "98%", label: "Satisfaction", sublabel: "Rating", icon: Heart },
            ];

            return (
              <div className="mt-10 sm:mt-14 bg-gradient-to-br from-[#FFF9F3] via-amber-50/40 to-orange-50/20 border border-amber-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm scroll-reveal">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y-0 sm:divide-y-0 divide-amber-200/40">
                  {DYNAMIC_STATS.map((st, i) => {
                    const StatIcon = st.icon;
                    return (
                      <div
                        key={i}
                        style={{ transitionDelay: `${i * 100}ms` }}
                        className="scroll-reveal flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-amber-100/80"
                      >
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-amber-200/80 flex items-center justify-center shrink-0 shadow-sm">
                          <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                            {st.value}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold text-neutral-800 leading-tight">
                            {st.label}
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-normal text-neutral-500 leading-tight">
                            {st.sublabel}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </section>



      {/* SECTION 2: EXPLORE OUR GALLERY */}
      <section className="py-16 sm:py-24 bg-stone-50/50 overflow-hidden border-t border-neutral-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-reveal">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {galleryData.titlePart1 || "Explore"} <span className="text-brand-yellow font-extrabold">{galleryData.titlePart2 || "Our Gallery"}</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-neutral-500 max-w-xl mx-auto mt-2">
              {galleryData.subtitle || "Discover beautifully designed coworking areas, meeting rooms, and virtual office setups that spark productivity and creativity."}
            </p>
          </div>

          {/* GALLERY MOSAIC GRID WITH SCROLL REVEAL & HOVER ZOOM */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Left 2x2 collage */}
            <div className="md:col-span-7 grid grid-cols-2 gap-4 sm:gap-5">
              <div
                style={{ transitionDelay: "0ms" }}
                className="scroll-reveal-scale h-44 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
              >
                <img
                  src={galleryData.img1 || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"}
                  alt="Coworking Team"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold">Collaborative Hubs</span>
                </div>
              </div>

              <div
                style={{ transitionDelay: "150ms" }}
                className="scroll-reveal-scale h-44 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
              >
                <img
                  src={galleryData.img2 || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"}
                  alt="Modern Desk"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold">Dedicated Workstations</span>
                </div>
              </div>

              <div
                style={{ transitionDelay: "300ms" }}
                className="scroll-reveal-scale h-44 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
              >
                <img
                  src={galleryData.img3 || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"}
                  alt="Reception Area"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold">Welcoming Receptions</span>
                </div>
              </div>

              <div
                style={{ transitionDelay: "450ms" }}
                className="scroll-reveal-scale h-44 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
              >
                <img
                  src={galleryData.img4 || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80"}
                  alt="Meeting Room"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold">High-Tech Conference Rooms</span>
                </div>
              </div>
            </div>

            {/* Right Large Vertical Photo */}
            <div
              style={{ transitionDelay: "200ms" }}
              className="scroll-reveal-scale md:col-span-5 h-80 md:h-[472px] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
            >
              <img
                src={galleryData.img5 || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80"}
                alt="Executive Suite"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">Premium Spaces</span>
                  <span className="text-white text-base font-serif font-bold">Executive Office Suites</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BUILDING A BETTER WORKSPACE */}
      <section className="py-16 sm:py-24 bg-[#F5F9FF] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-reveal">
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-neutral-500">
              {plansData.badge || "Work spaces Plans"}
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {plansData.titlePart1 || "Building A"} <span className="text-brand-yellow font-extrabold">{plansData.titlePart2 || "Better Workspace"}</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 max-w-xl mx-auto mt-2">
              {plansData.subtitle || "We create flexible, fully supported workspaces where businesses of every size can focus on what truly matters—growing, creating, and making an impact."}
            </p>
          </div>

          {/* VIRTUAL OFFICE FEATURE CARD WITH SCROLL REVEAL & HOVER LIFT */}
          <div className="scroll-reveal-scale relative max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-neutral-100 grid grid-cols-1 lg:grid-cols-12 items-center group transition-all duration-500">
            <div className="lg:col-span-7 h-72 sm:h-96 relative overflow-hidden">
              <img
                src={plansData.virtualOfficeImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"}
                alt="Virtual Office Plan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-neutral-900 shadow-sm border border-white/50">
                Most Popular
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
              <h3 className="text-2xl font-extrabold text-neutral-950 font-sans tracking-tight group-hover:text-amber-600 transition-colors">
                VIRTUAL OFFICE
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                A premium business address with full mail and documentation support—work from anywhere.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-extrabold text-neutral-900 font-mono">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3.5 py-2 rounded-xl border border-amber-200 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors duration-300">
                  <Check className="w-4 h-4 text-amber-600 group-hover:text-neutral-950 transition-colors" />
                  <span>₹ {plansData.virtualOfficeMonthly || "799"}</span> <span className="text-neutral-500 group-hover:text-neutral-900 font-normal">/ Per Month</span>
                </div>
                <div className="flex items-center gap-1.5 bg-stone-100 text-neutral-800 px-3.5 py-2 rounded-xl border border-neutral-200">
                  <Check className="w-4 h-4 text-neutral-600" />
                  <span>₹ {plansData.virtualOfficeDaily || "26"}</span> <span className="text-neutral-500 font-normal">/ Per Day</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTourModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-xl border-2 border-amber-500 text-neutral-950 bg-amber-400 hover:bg-amber-500 font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TARGET AUDIENCE / WORKSPACE SUITABILITY */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden border-t border-neutral-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto scroll-reveal">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Spaces Tailored <span className="text-brand-yellow font-extrabold">for Every Team &amp; Workstyle</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-3 leading-relaxed">
              {audienceData.subtitle || "At NexusHub Coworking, we understand the needs of every professional. Our cowork space is designed to serve four distinct groups according to your needs, work style, and situation."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {/* Card 1: Freelancers */}
            <div
              style={{ transitionDelay: "0ms" }}
              className="scroll-reveal group p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/80 hover:border-brand-yellow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow-light text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-neutral-950 transition-all duration-300">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3 group-hover:text-brand-yellow transition-colors">
                  Freelancers
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  {audienceData.freelancerDesc || "Working from home sounds great, but it comes with a lot of distractions, isolation, and a lack of a professional environment. A coworking space is best for freelancers. We give you a professional third space where you can focus deeply, meet your clients, and separate your work life from your personal life."}
                </p>
              </div>
            </div>

            {/* Card 2: Startups & Early-Stage Teams (Featured Yellow Border Card) */}
            <div
              style={{ transitionDelay: "150ms" }}
              className="scroll-reveal group p-6 sm:p-7 rounded-3xl bg-white border-2 border-brand-yellow shadow-[0_10px_30px_-10px_rgba(255,184,0,0.3)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow-light text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-neutral-950 transition-all duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3 group-hover:text-brand-yellow transition-colors">
                  Startups &amp; Early-Stage Teams
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  {audienceData.startupDesc || "For start-ups and early-stage teams, there is no sense in investing in office set-up for the initial days. Opt for a co-work space, which gives an affordable option. It makes your daily environment professional. Get private cabins or a flexible shared office with us according to your budget and your momentum."}
                </p>
              </div>
            </div>

            {/* Card 3: Remote Workers */}
            <div
              style={{ transitionDelay: "300ms" }}
              className="scroll-reveal group p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/80 hover:border-brand-yellow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow-light text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-neutral-950 transition-all duration-300">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3 group-hover:text-brand-yellow transition-colors">
                  Remote Workers
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  {audienceData.remoteDesc || "Working remotely from home full-time has productivity, professional, and psychological costs for remote workers. We offer the structure and social connection that home offices lack. You can have a professional office in your city without any corporate office registration with us."}
                </p>
              </div>
            </div>

            {/* Card 4: Established SMEs */}
            <div
              style={{ transitionDelay: "450ms" }}
              className="scroll-reveal group p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/80 hover:border-brand-yellow hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow-light text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow group-hover:text-neutral-950 transition-all duration-300">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3 group-hover:text-brand-yellow transition-colors">
                  Established SMEs Needing Flexible Office Space
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  {audienceData.smeDesc || "Nowadays, going to an office is also about flexible office space without investing in a commercial lease. We provide private cabins and dedicated team cabins with fully served services. Enjoy meeting rooms, printing, parking, and other amenities."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workspaces Section */}
      <section className="py-12 bg-white border-t border-neutral-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-mono block">Featured Workspaces</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">Tailored <span className="text-brand-yellow font-extrabold">Work Environments</span></h2>
            <div className="mt-3">
              <Link
                href="/workspaces"
                className="inline-flex items-center text-xs font-semibold text-neutral-600 hover:text-brand-yellow transition-colors"
              >
                View All Workspaces &rarr;
              </Link>
            </div>
          </div>

          {workspaces.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                {workspaces.slice(0, 6).map((ws, index) => (
                  <div key={ws._id} style={{ transitionDelay: `${(index % 3) * 150}ms` }} className="scroll-reveal-scale">
                    <WorkspaceCard workspace={ws} />
                  </div>
                ))}
              </div>

              {/* CENTERED VIEW MORE BUTTON */}
              <div className="mt-12 text-center scroll-reveal">
                <Link
                  href="/workspaces"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 gap-2.5 group"
                >
                  <span>View More Workspaces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-yellow" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 scroll-reveal">
              <p className="text-neutral-600">No workspaces available right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* NEW SECTION 1: WORLD-CLASS AMENITIES GRID */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-mono">INCLUDED WITH MEMBERSHIP</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              Everything You Need <span className="text-brand-yellow font-extrabold">to Succeed</span>
            </h2>
            <p className="text-neutral-500 text-sm mt-3">
              Designed to optimize productivity, foster well-being, and give your business an effortless advantage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {AMENITIES_LIST.map((item, idx) => {
              const AmenityIcon = item.icon;
              return (
                <div
                  key={idx}
                  style={{ transitionDelay: `${(idx % 4) * 100}ms` }}
                  className="scroll-reveal p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-stone-50 border border-neutral-100 hover:border-neutral-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300 shrink-0">
                      <AmenityIcon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 group-hover:text-brand-yellow transition-colors duration-300" />
                    </div>
                    <h3 className="text-xs sm:text-base font-bold text-neutral-900 mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 leading-snug sm:leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOP CITIES / CENTRES SECTION */}
      <section className="py-12 bg-stone-50 border-t border-neutral-100 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-mono block">EXPLORE CITIES</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">Workspaces in <span className="text-brand-yellow font-extrabold">Prime Locations</span></h2>
            <div className="mt-3">
              <Link
                href="/locations"
                className="inline-flex items-center text-xs font-semibold text-neutral-600 hover:text-brand-yellow transition-colors"
              >
                Explore All Locations &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(locations && locations.length > 0 ? locations : TOP_CITIES).slice(0, 4).map((loc: any, idx: number) => {
              const name = loc.name || loc.city || "Prime Location";
              const city = loc.city || loc.name || "Business Hub";
              const address = loc.address || loc.area || "DLF Cyber City, Golf Course Road";
              const image = loc.imageUrl || loc.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

              return (
                <Link
                  key={loc._id || idx}
                  href={`/locations?city=${encodeURIComponent(city)}`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                  className="scroll-reveal-scale group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 border border-neutral-100 flex flex-col justify-end p-6 transition-all duration-300"
                >
                  <img
                    src={image}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="relative z-10 text-white space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-1">
                      {loc.hubs || "Popular Centre"}
                    </span>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-amber-400 transition-colors">{name}</h3>
                    <p className="text-xs text-white/80 line-clamp-1">{address}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom View All Cities CTA */}
          <div className="mt-10 text-center scroll-reveal">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>View All Cities &amp; Centres</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ENTERPRISE SOLUTIONS SECTION */}
      <section className="py-12 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow block">FOR TEAMS & ENTERPRISES</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-white tracking-tight mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              Custom Built Workspaces <span className="text-brand-yellow font-extrabold">for Your Enterprise</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              From dedicated office floors to multi-city pass passes, NexusHub designs custom workspaces equipped with enterprise-grade security and amenities.
            </p>
          </div>

          {/* DESKTOP GRID (SHOW ALL 3) */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            <div style={{ transitionDelay: "0ms" }} className="scroll-reveal-left bg-neutral-800/80 rounded-3xl p-8 border border-neutral-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                <Building className="w-6 h-6 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Managed Office Suites</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dedicated private floors for teams of 50 to 500+ with custom branding, IT setup, and private meeting rooms.
              </p>
              <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-2">
                Talk to Enterprise Team &rarr;
              </button>
            </div>

            <div style={{ transitionDelay: "150ms" }} className="scroll-reveal bg-neutral-800/80 rounded-3xl p-8 border border-neutral-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Multi-City Access Pass</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Give your remote employee workforce access to over 300+ co-working locations across 100+ cities with a single enterprise bill.
              </p>
              <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-2">
                Get Multi-City Access &rarr;
              </button>
            </div>

            <div style={{ transitionDelay: "300ms" }} className="scroll-reveal-right bg-neutral-800/80 rounded-3xl p-8 border border-neutral-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-yellow" />
              </div>
              <h3 className="text-xl font-bold text-white">Enterprise Security &amp; IT</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dedicated VLANs, private server racks, biometrics, and 24/7 SLA uptime guarantee tailored for enterprise IT compliance.
              </p>
              <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-2">
                Talk to IT Expert &rarr;
              </button>
            </div>
          </div>

          {/* MOBILE SLIDER (AUTO SLIDES EVERY 3 SECONDS) */}
          <div className="md:hidden relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${enterpriseSlide * 100}%)` }}
            >
              <div className="w-full shrink-0 px-2">
                <div className="bg-neutral-800/90 rounded-3xl p-6 border border-neutral-700/60 space-y-3 min-h-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                    <Building className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Managed Office Suites</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Dedicated private floors for teams of 50 to 500+ with custom branding, IT setup, and private meeting rooms.
                  </p>
                  <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-1">
                    Talk to Enterprise Team &rarr;
                  </button>
                </div>
              </div>

              <div className="w-full shrink-0 px-2">
                <div className="bg-neutral-800/90 rounded-3xl p-6 border border-neutral-700/60 space-y-3 min-h-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Multi-City Access Pass</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Give your remote employee workforce access to over 300+ co-working locations across 100+ cities with a single enterprise bill.
                  </p>
                  <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-1">
                    Get Multi-City Access &rarr;
                  </button>
                </div>
              </div>

              <div className="w-full shrink-0 px-2">
                <div className="bg-neutral-800/90 rounded-3xl p-6 border border-neutral-700/60 space-y-3 min-h-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Enterprise Security &amp; IT</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Dedicated VLANs, private server racks, biometrics, and 24/7 SLA uptime guarantee tailored for enterprise IT compliance.
                  </p>
                  <button onClick={() => setIsTourModalOpen(true)} className="inline-flex items-center text-xs font-bold text-brand-yellow hover:underline pt-1">
                    Talk to IT Expert &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setEnterpriseSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${enterpriseSlide === idx ? "w-6 bg-brand-yellow" : "w-2 bg-neutral-700"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: FREQUENTLY ASKED QUESTIONS (FAQS ACCORDION) */}
      <section className="py-12 bg-stone-50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow font-mono">GOT QUESTIONS?</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-900 tracking-tight mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              Frequently Asked <span className="text-brand-yellow font-extrabold">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS_LIST.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className="scroll-reveal bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-neutral-900 hover:text-brand-yellow transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-yellow shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MEMBER TESTIMONIALS SECTION */}
      <section className="py-16 bg-gradient-to-b from-stone-50 via-amber-50/20 to-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2 font-mono">
              <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" /> MEMBER STORIES
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-neutral-950 tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              Loved by <span className="text-brand-yellow font-extrabold">2,00,000+ Professionals</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto mt-2">
              See how NexusHub empowers startups, freelancers, and enterprise teams across India.
            </p>
          </div>

          {/* DESKTOP GRID (SHOW ALL 3) */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                style={{ transitionDelay: `${idx * 150}ms` }}
                className="scroll-reveal-scale bg-white rounded-3xl p-7 border border-neutral-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                      {t.location}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-800 font-serif italic leading-relaxed relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-5 border-t border-neutral-100 mt-6 flex items-center gap-3.5 relative z-10">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                      {t.author}
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 fill-amber-100 shrink-0" />
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE AUTO SLIDER (EVERY 3 SECONDS) */}
          <div className="md:hidden relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${reviewSlide * 100}%)` }}
            >
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="w-full shrink-0 px-2">
                  <div className="bg-white rounded-3xl p-6 border border-neutral-200/70 shadow-lg flex flex-col justify-between min-h-[260px] relative">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1 text-amber-400">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                          {t.location}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-800 font-serif italic leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 mt-4 flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          {t.author}
                          <CheckCircle2 className="w-3 h-3 text-amber-600 fill-amber-100 shrink-0" />
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-medium">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setReviewSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${reviewSlide === idx ? "w-6 bg-amber-500" : "w-2 bg-neutral-300"}`}
                  aria-label={`Go to review slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Book a Tour Modal */}
      <BookTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      {/* List Your Space Admin Lead Modal */}
      <ListYourSpaceModal
        isOpen={isListSpaceModalOpen}
        onClose={() => setIsListSpaceModalOpen(false)}
      />
    </div>
  );
}
