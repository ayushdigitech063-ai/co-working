"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  PhoneCall, Menu, X, ChevronDown, User, LayoutDashboard,
  CalendarCheck, LogOut, MapPin, Building2, Shield, Sparkles, Building, ArrowRight,
  ChevronRight, ArrowLeft, Search, Edit3, Globe
} from "lucide-react";

// Helper to resolve State accurately even for older DB documents
const getLocState = (loc: any): string => {
  if (loc.state && loc.state.trim() !== "") return loc.state.trim();
  const c = (loc.city || loc.name || "").toLowerCase();
  if (c.includes("jaipur") || c.includes("udaipur") || c.includes("jodhpur")) return "Rajasthan";
  if (c.includes("gurugram") || c.includes("gurgaon") || c.includes("faridabad") || c.includes("panipat")) return "Haryana";
  if (c.includes("bengaluru") || c.includes("bangalore") || c.includes("mysuru") || c.includes("mangaburu") || c.includes("hubballi")) return "Karnataka";
  if (c.includes("mumbai") || c.includes("pune")) return "Maharashtra";
  if (c.includes("hyderabad")) return "Telangana";
  return "Other Regions";
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  // Active Dropdown state for Nav items
  const [activeNavDrop, setActiveNavDrop] = useState<string | null>(null);

  // Dynamic DB Data State for Live Navbar Dropdowns
  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  // Progressive Desktop Hover Drill-Down State (State -> City -> Area)
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Mobile Accordion Hierarchy State (< 768px)
  const [mobileMainSection, setMobileMainSection] = useState<"LOCATIONS" | "WORKSPACES" | "ENTERPRISE" | null>(null);
  const [mobileOpenState, setMobileOpenState] = useState<string | null>(null);
  const [mobileOpenCity, setMobileOpenCity] = useState<string | null>(null);
  const [mobileShowAllStates, setMobileShowAllStates] = useState<boolean>(false);
  const [mobileStateSearch, setMobileStateSearch] = useState<string>("");

  // Dynamic Support Phone State
  const [supportPhone, setSupportPhone] = useState<string>("1800 123 77888");
  const [editPhoneModal, setEditPhoneModal] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>("");

  useEffect(() => {
    // 1. Fetch from LocalStorage for instant render
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexushub_support_phone");
      if (stored) setSupportPhone(stored);
    }

    // 2. Fetch live settings from Backend API
    api.get("/settings")
      .then((res) => {
        if (res.data?.data?.supportPhone) {
          const apiPhone = res.data.data.supportPhone;
          setSupportPhone(apiPhone);
          if (typeof window !== "undefined") {
            localStorage.setItem("nexushub_support_phone", apiPhone);
          }
        }
      })
      .catch(() => {});

    const handlePhoneUpdate = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nexushub_support_phone");
        if (stored) setSupportPhone(stored);
      }
    };

    window.addEventListener("nexushub_phone_updated", handlePhoneUpdate);
    window.addEventListener("storage", handlePhoneUpdate);
    return () => {
      window.removeEventListener("nexushub_phone_updated", handlePhoneUpdate);
      window.removeEventListener("storage", handlePhoneUpdate);
    };
  }, []);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    const cleaned = phoneInput.trim();
    localStorage.setItem("nexushub_support_phone", cleaned);
    setSupportPhone(cleaned);
    window.dispatchEvent(new Event("nexushub_phone_updated"));
    setEditPhoneModal(false);
  };

  // Prevent background page scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  useEffect(() => {
    Promise.all([
      api.get("/locations").catch(() => ({ data: { data: [] } })),
      api.get("/workspace-types").catch(() => ({ data: { data: [] } })),
    ]).then(([locRes, typeRes]) => {
      const locData = locRes.data.data;
      const locList = Array.isArray(locData) ? locData : locData?.content || [];
      setLocations(locList);

      const typeData = typeRes.data.data;
      const typeList = Array.isArray(typeData) ? typeData : typeData?.content || [];
      setTypes(typeList);
    });
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Helper lists for Progressive Desktop Hover Drill-Down Mega Menu
  const availableStates = Array.from(new Set(locations.map(getLocState).filter(Boolean)));

  const availableCities = hoveredState
    ? Array.from(
        new Set(
          locations
            .filter((l) => getLocState(l) === hoveredState)
            .map((l) => l.city || l.name)
            .filter(Boolean)
        )
      )
    : [];

  const availableAreas = (hoveredState && hoveredCity)
    ? locations.filter(
        (l) => getLocState(l) === hoveredState && (l.city || l.name) === hoveredCity
      )
    : [];

  // Mobile Helpers
  const getCitiesForState = (stName: string) => {
    return Array.from(
      new Set(
        locations
          .filter((l) => getLocState(l) === stName)
          .map((l) => l.city || l.name)
          .filter(Boolean)
      )
    );
  };

  const getHubsForCity = (stName: string, cityName: string) => {
    return locations.filter(
      (l) => getLocState(l) === stName && (l.city || l.name) === cityName
    );
  };

  const toggleLocationsSection = () => {
    if (mobileMainSection === "LOCATIONS") {
      setMobileMainSection(null);
      setMobileOpenState(null);
      setMobileOpenCity(null);
    } else {
      setMobileMainSection("LOCATIONS");
      setMobileOpenState(null);
      setMobileOpenCity(null);
    }
  };

  const toggleWorkspacesSection = () => {
    if (mobileMainSection === "WORKSPACES") {
      setMobileMainSection(null);
    } else {
      setMobileMainSection("WORKSPACES");
      setMobileOpenState(null);
      setMobileOpenCity(null);
    }
  };

  const toggleStateAccordion = (st: string) => {
    if (mobileOpenState === st) {
      setMobileOpenState(null);
      setMobileOpenCity(null);
    } else {
      setMobileOpenState(st);
      setMobileOpenCity(null);
    }
  };

  const toggleCityAccordion = (ct: string) => {
    if (mobileOpenCity === ct) {
      setMobileOpenCity(null);
    } else {
      setMobileOpenCity(ct);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header suppressHydrationWarning className="sticky top-0 z-50 bg-white border-b border-neutral-200 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group py-1">
            <div className="h-14 sm:h-16 w-auto overflow-hidden rounded-xl">
              <img
                src="/logo.jpg"
                alt="Sumit's Co-Working Space Logo"
                className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Center Links with Live DB Dropdowns (DESKTOP UNCHANGED) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="/" className="text-xs xl:text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors">
              Home
            </Link>

            {/* 3-COLUMN DESKTOP MEGA MENU (STATE -> CITY -> AREA) - UNCHANGED */}
            <div
              className="relative"
              onMouseEnter={() => {
                setActiveNavDrop("locations");
                setHoveredState(null);
                setHoveredCity(null);
              }}
              onMouseLeave={() => {
                setActiveNavDrop(null);
                setHoveredState(null);
                setHoveredCity(null);
              }}
            >
              <button className="text-xs xl:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 py-6">
                Locations &amp; Hubs <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeNavDrop === "locations" ? "rotate-180 text-black" : ""}`} />
              </button>

              {activeNavDrop === "locations" && (
                <div
                  className={`absolute left-0 top-[90%] bg-white rounded-3xl border border-neutral-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden transition-all flex gap-5 ${
                    hoveredState && hoveredCity
                      ? "w-[880px]"
                      : hoveredState
                      ? "w-[540px]"
                      : "w-[260px]"
                  }`}
                >
                  {/* COL 1: STATES */}
                  <div className="w-56 shrink-0 border-r border-neutral-100 pr-3 space-y-1.5 overflow-y-auto max-h-[340px]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 px-3 py-1 font-mono">
                      1. SELECT STATE
                    </div>
                    {availableStates.map((st) => (
                      <div
                        key={st}
                        onMouseEnter={() => {
                          setHoveredState(st);
                          setHoveredCity(null);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold cursor-pointer transition-all ${
                          hoveredState === st
                            ? "bg-amber-600 text-white shadow-md font-bold"
                            : "text-neutral-900 hover:bg-stone-100"
                        }`}
                      >
                        <span>{st}</span>
                        <ChevronDown className="-rotate-90 w-4 h-4 opacity-70" />
                      </div>
                    ))}
                  </div>

                  {/* COL 2: CITIES */}
                  {hoveredState && (
                    <div className="w-56 shrink-0 border-r border-neutral-100 pr-3 space-y-1.5 overflow-y-auto max-h-[340px] animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 px-3 py-1 font-mono">
                        2. CITIES ({hoveredState})
                      </div>
                      {availableCities.length === 0 ? (
                        <div className="p-3 text-xs text-neutral-400 italic">No cities in {hoveredState}</div>
                      ) : (
                        availableCities.map((ct) => (
                          <div
                            key={ct}
                            onMouseEnter={() => setHoveredCity(ct)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold cursor-pointer transition-all ${
                              hoveredCity === ct
                                ? "bg-neutral-950 text-white shadow-md font-bold"
                                : "text-neutral-900 hover:bg-stone-100"
                            }`}
                          >
                            <span className="truncate">{ct}</span>
                            <ChevronDown className="-rotate-90 w-4 h-4 opacity-70" />
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* COL 3: AREAS & HUBS */}
                  {hoveredState && hoveredCity && (
                    <div className="w-72 shrink-0 space-y-1.5 overflow-y-auto max-h-[340px] animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 px-2 py-1 font-mono">
                        3. LOCALITIES &amp; HUBS ({hoveredCity})
                      </div>
                      {availableAreas.length === 0 ? (
                        <div className="p-3 text-xs text-neutral-400 italic">No areas in {hoveredCity}</div>
                      ) : (
                        availableAreas.map((loc) => {
                          const areaTitle = loc.area || loc.name;
                          const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                          const seoUrl = `/locations/${toSlug(hoveredState)}/${toSlug(hoveredCity)}/${toSlug(areaTitle)}`;

                          return (
                            <Link
                              key={loc._id}
                              href={seoUrl}
                              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm font-bold text-neutral-900 group border border-transparent hover:border-amber-200"
                            >
                              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <div className="truncate text-sm font-bold">{areaTitle}</div>
                                <div className="text-xs text-neutral-500 font-medium truncate">{loc.name}</div>
                              </div>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DYNAMIC WORKSPACES DROPDOWN (DESKTOP UNCHANGED) */}
            <div
              className="relative"
              onMouseEnter={() => setActiveNavDrop("workspaces")}
              onMouseLeave={() => setActiveNavDrop(null)}
            >
              <button className="text-xs xl:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 py-6">
                Workspaces <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeNavDrop === "workspaces" ? "rotate-180 text-black" : ""}`} />
              </button>

              {activeNavDrop === "workspaces" && (
                <div className="absolute left-0 top-[90%] w-96 bg-white rounded-2xl border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* DYNAMIC WORKSPACE TYPES */}

                  {types.length === 0 ? (
                    <div className="p-3 text-xs text-neutral-400 italic">No workspace categories added yet.</div>
                  ) : (
                    types.slice(0, 6).map((cat) => {
                      const catSlug = (cat.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                      const catImage = cat.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80";
                      return (
                        <Link
                          key={cat._id}
                          href={`/workspaces/type/${catSlug}`}
                          className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-stone-100 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-neutral-200 group-hover:border-amber-500 transition-colors">
                            <img
                              src={catImage}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">{cat.name}</div>
                            <div className="text-xs text-neutral-500 font-medium line-clamp-1">
                              {cat.description || "Flexible seating and private spaces"}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}

                  <div className="border-t border-neutral-100 mt-2.5 pt-2.5 text-center">
                    <Link href="/workspaces" className="inline-flex items-center text-sm font-bold text-neutral-900 hover:text-amber-600 py-1 transition-colors">
                      View All Workspaces <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* VIRTUAL OFFICE FEATURE DROPDOWN WITH REAL DB STATES & CITIES */}
            <div
              className="relative"
              onMouseEnter={() => {
                setActiveNavDrop("virtual-office");
                setHoveredState(null);
              }}
              onMouseLeave={() => {
                setActiveNavDrop(null);
                setHoveredState(null);
              }}
            >
              <button
                onClick={() => router.push("/workspaces/type/virtual-office")}
                className="text-xs xl:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 py-6"
              >
                <span>Virtual Office</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeNavDrop === "virtual-office" ? "rotate-180 text-black" : ""}`} />
              </button>

              {activeNavDrop === "virtual-office" && (
                <div
                  className={`absolute left-0 top-[90%] bg-white rounded-3xl border border-neutral-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden transition-all flex gap-4 ${
                    hoveredState ? "w-[540px]" : "w-[260px]"
                  }`}
                >
                  {/* COL 1: STATES */}
                  <div className="w-56 shrink-0 border-r border-neutral-100 pr-2 space-y-1 overflow-y-auto max-h-[340px]">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 px-3 py-1 font-mono">
                      VIRTUAL OFFICE STATES
                    </div>
                    {availableStates.length > 0 ? (
                      availableStates.map((st) => (
                        <div
                          key={st}
                          onMouseEnter={() => setHoveredState(st)}
                          onClick={() => {
                            const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                            router.push(`/locations/${toSlug(st)}`);
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            hoveredState === st
                              ? "bg-amber-600 text-white shadow-sm"
                              : "text-neutral-900 hover:bg-stone-100"
                          }`}
                        >
                          <span>Virtual Office {st}</span>
                          <ChevronDown className="-rotate-90 w-3.5 h-3.5 opacity-70" />
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-neutral-400">No states available</div>
                    )}
                  </div>

                  {/* COL 2: CITIES IN SELECTED STATE */}
                  {hoveredState && (
                    <div className="w-56 shrink-0 space-y-1 overflow-y-auto max-h-[340px] animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 px-3 py-1 font-mono">
                        CITIES IN {hoveredState.toUpperCase()}
                      </div>
                      {getCitiesForState(hoveredState).map((ct) => {
                        const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                        return (
                          <Link
                            key={ct}
                            href={`/locations/${toSlug(hoveredState)}/${toSlug(ct)}`}
                            className="block p-3 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          >
                            Virtual Office {ct}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enterprise Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveNavDrop("enterprise")}
              onMouseLeave={() => setActiveNavDrop(null)}
            >
              <button className="text-xs xl:text-sm font-semibold text-neutral-800 hover:text-black flex items-center gap-1 py-6">
                Enterprise Solutions <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${activeNavDrop === "enterprise" ? "rotate-180 text-black" : ""}`} />
              </button>

              {activeNavDrop === "enterprise" && (
                <div className="absolute left-0 top-[90%] w-96 bg-white rounded-2xl border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-600 px-3 py-1.5 mb-1 font-mono">
                    ENTERPRISE PLANS
                  </div>
                  <Link href="/workspaces" className="block p-3 rounded-xl hover:bg-stone-100 transition-colors">
                    <div className="text-sm font-bold text-neutral-900">Managed Office Floors</div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">Fully customized floors for 50 to 500+ employees</div>
                  </Link>
                  <Link href="/workspaces" className="block p-3 rounded-xl hover:bg-stone-100 transition-colors">
                    <div className="text-sm font-bold text-neutral-900">Multi-City Access Pass</div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">Seamless pass across 300+ hubs in India</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Investor Relations Partner Lead Form Page */}
            <Link href="/investor-relations" className="text-xs xl:text-sm font-semibold text-neutral-800 hover:text-amber-600 transition-colors">
              Investor Relations
            </Link>
          </nav>

          {/* Right Actions (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200/60">
              <a
                href={`tel:${supportPhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-xs xl:text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>{supportPhone}</span>
              </a>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors text-sm font-semibold text-neutral-800"
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>

                {userDropOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-neutral-100 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={
                        user.role === "SUPER_ADMIN"
                          ? "/superadmin"
                          : user.role === "ADMIN"
                          ? "/admin"
                          : "/my-bookings"
                      }
                      onClick={() => setUserDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-neutral-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-600" /> My Dashboard
                    </Link>

                    {user.role === "USER" && (
                      <Link href="/my-bookings" onClick={() => setUserDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <CalendarCheck className="w-4 h-4 text-neutral-400" /> My Bookings
                      </Link>
                    )}

                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full text-left font-semibold">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs xl:text-sm font-bold transition-colors shadow-md">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6 text-neutral-900" /> : <Menu className="w-6 h-6 text-neutral-900" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE ACCORDION NAVIGATION DRAWER (< 768px) */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
          {/* HOME LINK */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-bold text-neutral-900 border-b border-neutral-100"
          >
            Home
          </Link>

          {/* ================================================================= */}
          {/* SECTION 1: LOCATIONS & HUBS ACCORDION */}
          {/* ================================================================= */}
          <div className="border-b border-neutral-100 pb-3 space-y-2">
            <button
              onClick={toggleLocationsSection}
              className="w-full flex items-center justify-between py-2 text-left text-sm font-extrabold uppercase tracking-wider text-neutral-900 font-mono"
            >
              <span>LOCATIONS &amp; HUBS</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  mobileMainSection === "LOCATIONS" ? "rotate-180 text-amber-600" : ""
                }`}
              />
            </button>

            {mobileMainSection === "LOCATIONS" && (
              <div className="space-y-3 pt-2 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* SEARCH IN ALL STATES */}
                {mobileShowAllStates && (
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search state..."
                      value={mobileStateSearch}
                      onChange={(e) => setMobileStateSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* STATES LIST */}
                {(mobileShowAllStates
                  ? availableStates.filter((s) => s.toLowerCase().includes(mobileStateSearch.toLowerCase()))
                  : availableStates.slice(0, 5)
                ).map((st) => {
                  const isStateExpanded = mobileOpenState === st;
                  const citiesInState = getCitiesForState(st);

                  return (
                    <div key={st} className="rounded-2xl border border-neutral-200/80 overflow-hidden bg-stone-50/50">
                      {/* STATE HEADER */}
                      <button
                        onClick={() => toggleStateAccordion(st)}
                        className={`w-full flex items-center justify-between p-3.5 text-xs font-bold transition-colors ${
                          isStateExpanded ? "bg-neutral-950 text-white" : "text-neutral-900 hover:bg-stone-100"
                        }`}
                      >
                        <span className="font-extrabold">{st}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-medium ${isStateExpanded ? "text-neutral-300" : "text-neutral-500"}`}>
                            {citiesInState.length} {citiesInState.length === 1 ? "City" : "Cities"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isStateExpanded ? "rotate-180 text-amber-400" : "text-neutral-400"
                            }`}
                          />
                        </div>
                      </button>

                      {/* CITY ACCORDION (Inside State) */}
                      {isStateExpanded && (
                        <div className="p-2 space-y-2 bg-white border-t border-neutral-200/80 animate-in fade-in slide-in-from-top-1 duration-150">
                          {citiesInState.map((ct) => {
                            const isCityExpanded = mobileOpenCity === ct;
                            const hubsInCity = getHubsForCity(st, ct);

                            return (
                              <div key={ct} className="rounded-xl border border-neutral-100 overflow-hidden bg-stone-50">
                                {/* CITY HEADER */}
                                <button
                                  onClick={() => toggleCityAccordion(ct)}
                                  className={`w-full flex items-center justify-between p-3 text-xs font-bold transition-colors ${
                                    isCityExpanded ? "bg-amber-600 text-white" : "text-neutral-900 hover:bg-stone-200/60"
                                  }`}
                                >
                                  <span className="font-extrabold">{ct}</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-medium ${isCityExpanded ? "text-amber-100" : "text-neutral-500"}`}>
                                      {hubsInCity.length} {hubsInCity.length === 1 ? "Hub" : "Hubs"}
                                    </span>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        isCityExpanded ? "rotate-180 text-white" : "text-neutral-400"
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* HUBS LIST (Inside City) */}
                                {isCityExpanded && (
                                  <div className="p-2 space-y-1.5 bg-white border-t border-neutral-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {hubsInCity.map((loc) => {
                                      const areaTitle = loc.area || loc.name;
                                      const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                                      const wsUrl = `/locations/${toSlug(st)}/${toSlug(ct)}/${toSlug(areaTitle)}`;

                                      return (
                                        <Link
                                          key={loc._id}
                                          href={wsUrl}
                                          onClick={() => setMobileOpen(false)}
                                          className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-amber-50 hover:text-amber-900 transition-colors text-left group"
                                        >
                                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                          <div className="truncate">
                                            <div className="text-xs font-extrabold text-neutral-900 group-hover:text-amber-700 truncate">
                                              📍 {areaTitle}
                                            </div>
                                            <div className="text-[11px] text-neutral-500 truncate">{loc.name}</div>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* VIEW ALL STATES CTA */}
                <button
                  onClick={() => setMobileShowAllStates(!mobileShowAllStates)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  {mobileShowAllStates ? "Show Top States" : "View All 50+ States →"}
                </button>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* SECTION 2: WORKSPACES BY TYPE ACCORDION */}
          {/* ================================================================= */}
          <div className="border-b border-neutral-100 pb-3 space-y-2">
            <button
              onClick={toggleWorkspacesSection}
              className="w-full flex items-center justify-between py-2 text-left text-sm font-extrabold uppercase tracking-wider text-neutral-900 font-mono"
            >
              <span>WORKSPACES BY TYPE</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  mobileMainSection === "WORKSPACES" ? "rotate-180 text-amber-600" : ""
                }`}
              />
            </button>

            {mobileMainSection === "WORKSPACES" && (
              <div className="space-y-1.5 pt-2 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/workspaces"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <Building className="w-4 h-4 text-amber-600" /> 🏢 All Workspaces
                </Link>
                <Link
                  href="/workspaces/type/private-cabin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <Shield className="w-4 h-4 text-amber-600" /> 🏠 Private Cabin
                </Link>
                <Link
                  href="/workspaces/type/hot-desk"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" /> 💼 Hot Desk
                </Link>
                <Link
                  href="/workspaces/type/dedicated-desk"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <Building2 className="w-4 h-4 text-amber-600" /> 👥 Dedicated Desk
                </Link>
                <Link
                  href="/workspaces/type/meeting-room"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <Building className="w-4 h-4 text-amber-600" /> 🏢 Meeting Room
                </Link>
                <Link
                  href="/workspaces/type/virtual-office"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors text-xs font-bold text-neutral-900"
                >
                  <MapPin className="w-4 h-4 text-amber-600" /> 🌐 Virtual Office
                </Link>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* SECTION 3: ENTERPRISE SOLUTIONS ACCORDION */}
          {/* ================================================================= */}
          <div className="border-b border-neutral-100 pb-3 space-y-2">
            <button
              onClick={() => {
                if (mobileMainSection === "ENTERPRISE") {
                  setMobileMainSection(null);
                } else {
                  setMobileMainSection("ENTERPRISE");
                  setMobileOpenState(null);
                  setMobileOpenCity(null);
                }
              }}
              className="w-full flex items-center justify-between py-2 text-left text-sm font-extrabold uppercase tracking-wider text-neutral-900 font-mono"
            >
              <span>ENTERPRISE SOLUTIONS</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                  mobileMainSection === "ENTERPRISE" ? "rotate-180 text-amber-600" : ""
                }`}
              />
            </button>

            {mobileMainSection === "ENTERPRISE" && (
              <div className="space-y-2 pt-2 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <Link
                  href="/workspaces"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                >
                  <div className="text-xs font-bold text-neutral-900">Managed Office Floors</div>
                  <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Fully customized floors for 50 to 500+ employees</div>
                </Link>
                <Link
                  href="/workspaces"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 rounded-xl bg-stone-50 border border-neutral-200/70 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                >
                  <div className="text-xs font-bold text-neutral-900">Multi-City Access Pass</div>
                  <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Seamless pass across 300+ hubs in India</div>
                </Link>
              </div>
            )}
          </div>

          {/* INVESTOR RELATIONS & CALL SUPPORT */}
          <Link
            href="/investor-relations"
            onClick={() => setMobileOpen(false)}
            className="block py-2.5 text-sm font-bold text-amber-600 border-b border-neutral-100"
          >
            Investor &amp; Partner Application
          </Link>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80">
            <a
              href={`tel:${supportPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" /> Call Support: {supportPhone}
            </a>
          </div>

          {/* USER AUTH / DASHBOARD */}
          {user ? (
            <div className="pt-2 space-y-2 border-t border-neutral-100">
              <div className="p-3 rounded-2xl bg-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900">{user.name}</p>
                  <p className="text-[11px] text-neutral-500">{user.email}</p>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-600 text-white px-2 py-0.5 rounded-md font-mono">
                  {user.role}
                </span>
              </div>

              <Link
                href={
                  user.role === "SUPER_ADMIN"
                    ? "/superadmin"
                    : user.role === "ADMIN"
                    ? "/admin"
                    : "/my-bookings"
                }
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-xl bg-neutral-950 text-white font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" /> My Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs text-center"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-2 border-t border-neutral-100">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-xl border border-neutral-300 text-center font-bold text-sm text-neutral-900"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-xl bg-neutral-950 text-white text-center font-bold text-sm shadow-md"
              >
                Get in touch
              </Link>
            </div>
          )}
        </div>
      )}

      {/* SUPER ADMIN QUICK EDIT PHONE MODAL */}
      {editPhoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-950">Update Toll-Free Phone Number</h3>
                  <p className="text-xs text-neutral-500">Visible on Navbar &amp; Footer across site</p>
                </div>
              </div>
              <button
                onClick={() => setEditPhoneModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhone} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono">
                  Support Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 1800 123 77888 or +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-neutral-300 text-sm font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditPhoneModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors shadow-md"
                >
                  Save Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
