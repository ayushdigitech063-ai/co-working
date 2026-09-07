"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Building2, Users, CheckSquare, LayoutDashboard, MapPin,
  CalendarCheck, MessageSquare, Star, Settings, FileText,
  LogOut, ShieldAlert, Menu, X, ChevronRight, Loader2
} from "lucide-react";

const SUPER_ADMIN_NAV = [
  { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/admins", label: "Admin Management", icon: Users },
  { href: "/super-admin/approvals", label: "Content Approvals", icon: CheckSquare },
  { href: "/super-admin/workspaces", label: "Workspaces", icon: Building2 },
  { href: "/super-admin/locations", label: "Locations", icon: MapPin },
  { href: "/super-admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/super-admin/leads", label: "Leads & Enquiries", icon: MessageSquare },
  { href: "/super-admin/reviews", label: "Reviews", icon: Star },
  { href: "/super-admin/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/super-admin/settings", label: "Settings", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If path is /super-admin/login, bypass layout wrapper
  if (pathname === "/super-admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/super-admin/login");
      } else if (user.role !== "SUPER_ADMIN") {
        router.push(user.role === "ADMIN" ? "/admin" : "/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-xs font-semibold text-neutral-500">Verifying Super Admin Authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950 text-white border-b border-neutral-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/super-admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-neutral-950 font-bold" />
                </div>
                <span className="font-serif font-bold text-lg text-white tracking-tight">
                  NexusHub <span className="text-amber-500 text-xs uppercase font-sans font-extrabold tracking-widest ml-1">Super Admin</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs font-semibold text-neutral-400 hover:text-white transition">
                View Public Site &rarr;
              </Link>

              <div className="h-4 w-[1px] bg-neutral-800" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xs font-bold">
                  SA
                </div>
                <span className="text-xs font-bold text-neutral-200 hidden sm:inline">{user.name}</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Layout with Fixed Sticky Sidebar */}
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-4rem)] p-4 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-2">
            System Control
          </div>
          {SUPER_ADMIN_NAV.map((nav) => {
            const IconComp = nav.icon;
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-md"
                    : "text-neutral-600 hover:bg-stone-100 hover:text-neutral-900"
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                <span>{nav.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex">
            <div className="w-64 bg-white min-h-full p-4 space-y-1 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-100">
                <span className="font-bold text-sm text-neutral-900">Navigation</span>
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-neutral-500" /></button>
              </div>
              {SUPER_ADMIN_NAV.map((nav) => {
                const IconComp = nav.icon;
                const isActive = pathname === nav.href;
                return (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? "bg-neutral-950 text-white" : "text-neutral-600 hover:bg-stone-100"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
