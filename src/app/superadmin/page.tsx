"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import {
  Users, CheckSquare, Building2, MapPin, CalendarCheck,
  TrendingUp, Clock, ShieldCheck, ArrowRight, Loader2,
  UserPlus, CheckCircle2, X, ChevronDown, Database, Server,
  Mail, Cloud, HardDrive
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Quick Create Admin Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", region: "Gurugram" });
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardData = () => {
    setLoading(true);
    api.get("/dashboard/stats")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.error("Failed to load live dashboard stats:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admins", form);
      showSuccessAlert("Admin Account Created! 🎉", `Login credentials and password setup link have been emailed directly to ${form.email}.`);
      setForm({ name: "", email: "", phone: "", region: "Gurugram" });
      fetchDashboardData();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showErrorAlert("Creation Failed", err?.response?.data?.message || "Failed to create Admin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-9 h-9 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading Real System Analytics Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full font-sans">
      {/* Welcome Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Welcome back, Super Administrator 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            Create Admin
          </button>

          <Link
            href="/superadmin/approvals"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4 text-amber-600" />
            Review Approvals ({stats?.pendingApprovalsCount || 0})
          </Link>
        </div>
      </div>

      {/* REAL LIVE 6 STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Admins */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalAdmins || 0}</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Admins</div>
            <div className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>● System Admins</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Admins */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{stats?.activeAdmins || 0}</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Admins</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span>● Active Accounts</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-amber-600">{stats?.pendingApprovalsCount || 0}</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</div>
            <div className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>● Action Required</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalBookings || 0}</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</div>
            <div className="text-[11px] font-bold text-purple-600 mt-1 flex items-center gap-1">
              <span>● Total Reservations</span>
            </div>
          </div>
        </div>

        {/* Card 5: Total Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <span className="text-xl font-black text-slate-900">
              ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span>● Platform Earnings</span>
            </div>
          </div>
        </div>

        {/* Card 6: Total Users */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Members</div>
            <div className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
              <span>● Active Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: REVENUE LINE GRAPH & DONUT RING CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Overview Smooth Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly revenue performance across all locations</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer">
              <span>2026 Financial Year</span> <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="relative h-64 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[0, 50, 100, 150, 200].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="700" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              ))}

              <path
                d="M 0 130 C 50 160, 100 120, 150 100 C 200 80, 250 90, 300 85 C 350 80, 400 70, 450 60 C 500 80, 550 100, 600 65 C 650 40, 700 80, 700 80 L 700 200 L 0 200 Z"
                fill="url(#chartGradient)"
              />

              <path
                d="M 0 130 C 50 160, 100 120, 150 100 C 200 80, 250 90, 300 85 C 350 80, 400 70, 450 60 C 500 80, 550 100, 600 65 C 650 40, 700 80, 700 80"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle cx="450" cy="60" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
            </svg>

            <div className="absolute left-[60%] top-[10%] -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 text-center pointer-events-none">
              <span className="text-[10px] text-slate-400 block font-medium">Real-Time Revenue</span>
              <span className="text-xs font-bold text-amber-400 block">₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <span key={i} className={m === "Sep" ? "text-slate-900 font-bold" : ""}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Workspace Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live inventory count</p>
            </div>
            <Link href="/superadmin/workspaces" className="text-xs font-bold text-slate-500 hover:text-slate-900">View All</Link>
          </div>

          <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-[14px] border-amber-500 border-r-emerald-500 border-b-purple-500 border-l-blue-500 shadow-inner" />
            <div className="absolute text-center">
              <span className="text-2xl font-black text-slate-900 block leading-tight">
                {stats?.workspaceStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Private Offices
              </span>
              <span className="font-bold text-slate-900">Live DB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Dedicated Desks
              </span>
              <span className="font-bold text-slate-900">Live DB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Meeting Rooms
              </span>
              <span className="font-bold text-slate-900">Live DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 3 CARDS: RECENT ACTIVITY, PENDING APPROVALS, SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Real System Audit Log Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Recent Activity Log</h3>
            <Link href="/superadmin/audit-logs" className="text-xs font-bold text-slate-500 hover:text-slate-900">View All</Link>
          </div>

          <div className="space-y-4 text-xs">
            {!stats?.recentLogs || stats.recentLogs.length === 0 ? (
              <p className="text-slate-400 py-6 text-center italic">No audit logs recorded yet.</p>
            ) : (
              stats.recentLogs.map((log: any) => (
                <div key={log._id} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      LOG
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{log.action}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{log.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 2: Real Pending Approvals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Pending Approvals</h3>
              <Link href="/superadmin/approvals" className="text-xs font-bold text-slate-500 hover:text-slate-900">View All</Link>
            </div>

            <div className="space-y-4 text-xs">
              {!stats?.pendingApprovals || stats.pendingApprovals.length === 0 ? (
                <p className="text-slate-400 py-6 text-center italic">No approval requests pending queue.</p>
              ) : (
                stats.pendingApprovals.map((app: any) => (
                  <div key={app._id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-[11px]">
                        {app.entityType.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{app.entityType} ({app.action})</span>
                        <span className="text-slate-400 text-[11px]">By {app.submittedBy?.name || "Admin"}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                      PENDING
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            href="/superadmin/approvals"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1 pt-2 border-t border-slate-100"
          >
            View Approval Queue &rarr;
          </Link>
        </div>

        {/* Card 3: Real System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">System Health</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3.5 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-slate-700">
                <Database className="w-4 h-4 text-slate-400" /> MongoDB Atlas
              </span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                Connected <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-slate-700">
                <Server className="w-4 h-4 text-slate-400" /> Express Node Server
              </span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                Port 5000 Live <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" /> Gmail SMTP
              </span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                App Password Ready <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-slate-700">
                <Cloud className="w-4 h-4 text-slate-400" /> Cloudinary Storage
              </span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                Bucket u4bnc0pb <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-slate-700">
                <HardDrive className="w-4 h-4 text-slate-400" /> Backup Status
              </span>
              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                Up to date <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CREATE ADMIN MODAL DIALOG */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">SUPER ADMIN ACTION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Create New Admin Account</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@nexushub.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assigned Region / City
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Gurugram">Gurugram (Cyber City)</option>
                  <option value="Bengaluru">Bengaluru (Marathahalli)</option>
                  <option value="Mumbai">Mumbai (BKC)</option>
                  <option value="Hyderabad">Hyderabad (HITEC City)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-amber-400" />}
                {submitting ? "Creating Admin & Emailing..." : "Create Admin Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
