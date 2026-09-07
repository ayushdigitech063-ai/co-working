"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  Building2, Users, CheckSquare, LayoutDashboard, MapPin,
  CalendarCheck, MessageSquare, Star, Settings, FileText,
  LogOut, ShieldAlert, ChevronRight, Bell, Sliders, ChevronDown, Menu, X, ArrowRight, Layers
} from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Notifications State
  const [pendingBadge, setPendingBadge] = useState<number>(0);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [newLeadsList, setNewLeadsList] = useState<any[]>([]);
  const [showNotifDrop, setShowNotifDrop] = useState(false);

  const loadNotifications = () => {
    if (!user || user.role !== "SUPER_ADMIN") return;
    Promise.all([
      api.get("/approvals?status=PENDING"),
      api.get("/queries?status=NEW"),
    ])
      .then(([appRes, leadRes]) => {
        const approvals = appRes.data.data.content || [];
        const leads = leadRes.data.data.content || [];
        setPendingBadge(approvals.length + leads.length);
        setPendingList(approvals);
        setNewLeadsList(leads);
      })
      .catch(() => {
        setPendingBadge(0);
        setPendingList([]);
        setNewLeadsList([]);
      });
  };

  useEffect(() => {
    if (pathname === "/superadmin/login") return;

    if (!isLoading) {
      if (!user) {
        router.push("/superadmin/login");
      } else if (user.role !== "SUPER_ADMIN") {
        router.push(user.role === "ADMIN" ? "/admin" : "/login");
      } else {
        loadNotifications();

        // Listen for lead status updates
        window.addEventListener("nexushub_lead_updated", loadNotifications);
        // Periodic interval poll every 10 seconds
        const interval = setInterval(loadNotifications, 10000);

        return () => {
          window.removeEventListener("nexushub_lead_updated", loadNotifications);
          clearInterval(interval);
        };
      }
    }
  }, [user, isLoading, router, pathname]);

  if (pathname === "/superadmin/login") {
    return <>{children}</>;
  }

  if (isLoading || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-neutral-500">Verifying Super Admin Authorization...</p>
      </div>
    );
  }

  const ADMIN_PANEL_NAV = [
    { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/superadmin/categories", label: "Categories", icon: Layers, hasArrow: true },
    { href: "/superadmin/admins", label: "Admin Management", icon: Users, hasArrow: true },
    { href: "/superadmin/approvals", label: "Content Approvals", icon: CheckSquare, badge: pendingBadge > 0 ? String(pendingBadge) : undefined, hasArrow: true },
    { href: "/superadmin/workspaces", label: "Workspaces", icon: Building2, hasArrow: true },
    { href: "/superadmin/locations", label: "Locations", icon: MapPin, hasArrow: true },
    { href: "/superadmin/bookings", label: "Bookings", icon: CalendarCheck, hasArrow: true },
    { href: "/superadmin/queries", label: "Queries", icon: MessageSquare, hasArrow: true },
    { href: "/superadmin/reviews", label: "Reviews", icon: Star, hasArrow: true },
    { href: "/superadmin/users", label: "Users", icon: Users, hasArrow: true },
    { href: "/superadmin/audit-logs", label: "Audit Logs", icon: FileText, hasArrow: true },
  ];

  const SYSTEM_NAV = [
    { href: "/superadmin/settings", label: "Settings", icon: Settings, hasArrow: true },
    { href: "/superadmin/settings/config", label: "System Configuration", icon: Sliders, hasArrow: true },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-neutral-900 flex flex-col lg:flex-row font-sans">
      {/* MOBILE HEADER */}
      <header className="lg:hidden h-20 bg-[#0f172a] text-white px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/superadmin" className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="Sumit's Co-Working Space"
              className="h-10 w-auto object-contain rounded-lg"
            />
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest font-mono">
              SUPER ADMIN
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center">
            SA
          </div>
        </div>
      </header>

      {/* DESKTOP FIXED SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#0f172a] text-white flex-col justify-between min-h-screen shrink-0 border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Top Logo */}
          <Link href="/superadmin" className="flex items-center gap-3 px-2 pt-1">
            <div className="h-12 w-auto flex items-center shrink-0">
              <img
                src="/logo.jpg"
                alt="Sumit's Co-Working Space"
                className="h-12 w-auto object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest block font-mono">
                SUPER ADMIN
              </span>
            </div>
          </Link>

          {/* Nav Group 1: Admin Panel */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              ADMIN PANEL
            </div>
            {ADMIN_PANEL_NAV.map((nav) => {
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
                        isActive ? "bg-neutral-950 text-amber-400" : "bg-amber-500 text-neutral-950"
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

          {/* Nav Group 2: System */}
          <div className="space-y-1 pt-3 border-t border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              SYSTEM
            </div>
            {SYSTEM_NAV.map((nav) => {
              const IconComp = nav.icon;
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-neutral-950 font-bold shadow-md"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-slate-400"}`} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.hasArrow && !isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer" onClick={() => logout()}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-xs font-black shrink-0">
                SA
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
              </div>
            </div>
            <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition shrink-0" />
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0f172a] text-white flex flex-col justify-between h-full p-5 space-y-6 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <span className="font-serif font-bold text-base">Super Admin</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                {ADMIN_PANEL_NAV.map((nav) => {
                  const IconComp = nav.icon;
                  const isActive = pathname === nav.href;
                  return (
                    <Link
                      key={nav.href}
                      href={nav.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? "bg-amber-500 text-neutral-950 font-bold" : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4" />
                        <span>{nav.label}</span>
                      </div>
                      {nav.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950">
                          {nav.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
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
        {/* TALLER TOP NAVBAR (h-20 = 5rem) */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-end sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6">
            {/* LIVE DYNAMIC NOTIFICATION BELL & DROPDOWN CARD */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDrop(!showNotifDrop)}
                className="relative p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-slate-700 focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {pendingBadge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center px-1.5 border-2 border-white shadow-sm animate-pulse">
                    {pendingBadge}
                  </span>
                )}
              </button>

              {/* NOTIFICATIONS DROPDOWN CARD */}
              {showNotifDrop && (
                <div className="absolute right-0 mt-3 w-88 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in duration-150 space-y-3 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Notifications &amp; Leads</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
                      {pendingBadge} New
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {/* 1. Inquiries & Admin Partner Leads */}
                    {newLeadsList.map((lead) => (
                      <Link
                        key={lead._id}
                        href="/superadmin/queries"
                        onClick={() => setShowNotifDrop(false)}
                        className="block p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/70 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> {lead.name}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                            {lead.message?.includes("[LIST YOUR SPACE") ? "PARTNER LEAD" : "INQUIRY"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 font-medium">
                          {lead.email} &bull; {lead.phone}
                        </p>
                      </Link>
                    ))}

                    {/* 2. Pending Content Approvals */}
                    {pendingList.map((item) => (
                      <Link
                        key={item._id}
                        href="/superadmin/approvals"
                        onClick={() => setShowNotifDrop(false)}
                        className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{item.entityType} ({item.action})</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Approval</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Submitted by {item.submittedBy?.name || "Admin"}</p>
                      </Link>
                    ))}

                    {newLeadsList.length === 0 && pendingList.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6 italic">
                        No pending leads or notifications.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <Link
                      href="/superadmin/queries"
                      onClick={() => setShowNotifDrop(false)}
                      className="block text-center py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      View All Leads
                    </Link>
                    <Link
                      href="/superadmin/approvals"
                      onClick={() => setShowNotifDrop(false)}
                      className="block text-center py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition"
                    >
                      Approvals Queue
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* SUPER ADMIN CIRCULAR AVATAR BUTTON WITH HOVER DROPDOWN */}
            <div className="relative group">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center shadow-sm border-2 border-white transition-transform hover:scale-105 focus:outline-none cursor-pointer"
              >
                SA
              </button>

              {/* Hover/Focus Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block px-2 py-0.5 mt-1.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase font-mono">
                    Super Admin
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-between transition group/btn cursor-pointer"
                  >
                    <span>Logout</span>
                    <LogOut className="w-3.5 h-3.5 text-rose-500 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
