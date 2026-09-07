"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Building2, LayoutDashboard, MapPin, CalendarCheck,
  HelpCircle, Star, Settings, FileText, LogOut,
  ChevronRight, Bell, ChevronDown, Menu, X, Clock, Layers
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cms", label: "Homepage CMS", icon: Layers, hasArrow: true },
  { href: "/admin/workspaces", label: "My Workspaces", icon: Building2, hasArrow: true },
  { href: "/admin/locations", label: "Locations", icon: MapPin, hasArrow: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, hasArrow: true },
  { href: "/admin/queries", label: "Queries", icon: HelpCircle, hasArrow: true },
  { href: "/admin/reviews", label: "Reviews", icon: Star, hasArrow: true },
  { href: "/admin/submissions", label: "My Submissions", icon: Clock, badge: "Pending", hasArrow: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-neutral-500">Verifying Admin Authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col lg:flex-row font-sans">
      {/* MOBILE HEADER */}
      <header className="lg:hidden h-20 bg-[#0f172a] text-white px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="Sumit's Co-Working Space"
              className="h-10 w-auto object-contain rounded-lg"
            />
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest font-mono">
              {user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN"}
            </span>
          </Link>
        </div>

        <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* DESKTOP FIXED DARK SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#0f172a] text-white flex-col justify-between min-h-screen shrink-0 border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Top Logo */}
          <Link href="/admin" className="flex items-center gap-3 px-2 pt-1">
            <div className="h-12 w-auto flex items-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Sumit's Co-Working Space"
                className="h-12 w-auto object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest block font-mono">
                {user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "REGIONAL ADMIN"}
              </span>
            </div>
          </Link>

          {/* Admin Navigation Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              MANAGEMENT PANEL
            </div>
            {ADMIN_NAV.map((nav) => {
              const IconComp = nav.icon;
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {nav.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? "bg-neutral-950 text-amber-400" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}>
                        {nav.badge}
                      </span>
                    )}
                    {nav.hasArrow && !isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile Footer Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer" onClick={() => logout()}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-xs font-black shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                <span className="text-[11px] text-slate-400 block truncate">{user.region || "Gurugram"} Region</span>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition shrink-0" />
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0f172a] text-white flex flex-col justify-between h-full p-5 space-y-6 overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <span className="font-serif font-bold text-base">Regional Admin</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                {ADMIN_NAV.map((nav) => {
                  const IconComp = nav.icon;
                  const isActive = pathname === nav.href;
                  return (
                    <Link
                      key={nav.href}
                      href={nav.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? "bg-amber-500 text-neutral-950 font-bold" : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4" />
                        <span>{nav.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="w-full py-3 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Top Navbar */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">
            NexusHub Regional Admin Portal &bull; <span className="text-emerald-600 font-bold">Active Region: {user.region || "Gurugram"}</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block">{user.name}</span>
                <span className="text-[10px] font-medium text-slate-500 block">{user.region || "Gurugram"} Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
