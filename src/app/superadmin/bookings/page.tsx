"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { CalendarCheck, Search, Filter, Loader2, Building2, User, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function SuperAdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings", { params: { status: statusFilter } });
      const list = res.data?.data?.content || [];
      setBookings(list);
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err);
      showErrorAlert("Load Error", err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.user?.name?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.workspace?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 w-full font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">SUPER ADMIN CONTROL PANEL</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Nationwide Bookings Overview</h1>
          <p className="text-xs text-slate-500 font-medium">Track member reservations, active tenures, and platform billing across all hubs.</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member name, email, workspace..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading Nationwide Bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Bookings Found</h4>
            <p className="text-xs text-slate-400">Member workspace bookings will be displayed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Member Info</th>
                  <th className="px-5 py-4">Reserved Workspace</th>
                  <th className="px-5 py-4">Booking Dates</th>
                  <th className="px-5 py-4">Total Amount</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600" /> {b.user?.name || "Member User"}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {b.user?.email || "user@example.com"}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {b.workspace?.name || "Workspace Unit"}
                      </div>
                    </td>

                    <td className="px-5 py-4 space-y-1 font-mono text-[11px]">
                      <div>Start: {new Date(b.startDate).toLocaleDateString("en-IN")}</div>
                      <div>End: {new Date(b.endDate).toLocaleDateString("en-IN")}</div>
                    </td>

                    <td className="px-5 py-4 font-bold text-amber-700 font-mono text-sm">
                      ₹{(b.totalPrice || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        ● {b.status || "CONFIRMED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
