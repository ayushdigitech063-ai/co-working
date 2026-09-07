"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { HelpCircle, Loader2, Mail, Phone, MapPin, Building2, User, Search, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";

export default function AdminQueriesPage() {
  const { user } = useAuth();
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchQueries = () => {
    setLoading(true);
    api.get("/queries")
      .then((res) => {
        const data = res.data.data;
        const list = Array.isArray(data) ? data : data?.content || [];
        setQueries(list);
      })
      .catch((err) => console.error("Failed to load regional queries:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueries();
  }, [user]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/queries/${id}/status`, { status: newStatus });
      showSuccessAlert("Status Updated", `Lead status updated to ${newStatus}.`);
      fetchQueries();
    } catch (err: any) {
      showErrorAlert("Update Failed", err?.response?.data?.message || "Failed to update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredQueries = queries.filter((q) => {
    const s = search.toLowerCase();
    return (
      q.name?.toLowerCase().includes(s) ||
      q.email?.toLowerCase().includes(s) ||
      q.phone?.includes(s) ||
      q.workspace?.name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">
            REGIONAL ADMIN DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Customer Leads &amp; Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage member leads and tour requests for your created workspace inventory.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-4">Customer Details</th>
                <th className="px-5 py-4">Requested Space</th>
                <th className="px-5 py-4">Move-in &amp; Seats</th>
                <th className="px-5 py-4">Message</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Fetching Customer Leads...
                  </td>
                </tr>
              ) : filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    No customer leads received for your workspaces yet.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-600" /> {q.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {q.email}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" /> +91 {q.phone}
                      </div>
                    </td>

                    <td className="px-5 py-4 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {q.workspace?.name || "General Workspace Inquiry"}
                      </div>
                    </td>

                    <td className="px-5 py-4 space-y-1 font-mono">
                      <div className="text-slate-900 font-bold">📅 {q.moveInDate || "Immediate"}</div>
                      <div className="text-[11px] text-slate-500">👥 {q.seats || 1} Seat(s)</div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-slate-600 leading-relaxed truncate-2-lines text-[11px]">
                        &ldquo;{q.message}&rdquo;
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          q.status === "CONVERTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : q.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-800"
                            : q.status === "CLOSED"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        ● {q.status || "NEW"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <select
                        disabled={updatingId === q._id}
                        value={q.status || "NEW"}
                        onChange={(e) => handleStatusUpdate(q._id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="NEW">Set NEW</option>
                        <option value="CONTACTED">Mark Contacted</option>
                        <option value="CONVERTED">Mark Converted</option>
                        <option value="CLOSED">Close Lead</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
