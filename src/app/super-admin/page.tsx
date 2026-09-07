"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import {
  Users, CheckSquare, Building2, MapPin, CalendarCheck,
  TrendingUp, Clock, AlertTriangle, ShieldCheck, ArrowRight, Loader2
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admins"),
      api.get("/approvals?status=PENDING"),
      api.get("/bookings/stats"),
    ])
      .then(([admRes, appRes, bookRes]) => {
        setStats({
          adminStats: admRes.data.data.stats,
          pendingApprovalsCount: appRes.data.data.totalElements,
          bookingStats: bookRes.data.data,
        });
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-3" />
        <p className="text-xs font-semibold text-neutral-500">Loading Super Admin Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-3xl p-8 border border-neutral-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            3-TIER ENTERPRISE CONTROL CENTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Super Admin Overview
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl">
            Complete system authority. Manage Admin accounts, review pending content approvals, and monitor enterprise activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/super-admin/admins"
            className="px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition"
          >
            Create Admin
          </Link>
          <Link
            href="/super-admin/approvals"
            className="px-5 py-3 rounded-xl bg-neutral-800 text-white font-bold text-xs hover:bg-neutral-700 transition border border-neutral-700"
          >
            Review Approvals
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-neutral-950">{stats?.adminStats?.total || 0}</div>
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">Total Admins</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats?.pendingApprovalsCount || 0}</div>
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">Pending Approvals</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-neutral-950">{stats?.bookingStats?.total || 0}</div>
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">Total Bookings</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-neutral-950">
            ₹{(stats?.bookingStats?.totalRevenue || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">Total Revenue</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/super-admin/admins"
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">Admin Management</h3>
            <p className="text-xs text-neutral-500 mt-1">Create Admin accounts, generate temporary passwords &amp; suspend/activate access.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-amber-600">
            Manage Admins <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/super-admin/approvals"
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">Approval Queue</h3>
            <p className="text-xs text-neutral-500 mt-1">Approve or reject Admin-submitted Workspaces, Locations, and Gallery changes.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-amber-600">
            View Approval Queue <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/super-admin/audit-logs"
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">Audit Trail Logs</h3>
            <p className="text-xs text-neutral-500 mt-1">Immutable security log tracking every administrative operation in real-time.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-bold text-amber-600">
            Inspect Audit Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
