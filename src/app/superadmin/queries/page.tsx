"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { MessageSquare, Search, Filter, Loader2, Phone, Mail, Calendar, User, MapPin, Building2, CheckCircle2, Clock } from "lucide-react";

export default function SuperAdminQueriesPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [dbLocations, setDbLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [leadsRes, locsRes] = await Promise.all([
        api.get("/queries", { params: { status: statusFilter } }),
        api.get("/locations"),
      ]);
      const list = leadsRes.data?.data?.content || [];
      setLeads(list);
      const locList = Array.isArray(locsRes.data?.data) ? locsRes.data?.data : locsRes.data?.data?.content || [];
      setDbLocations(locList);
    } catch (err: any) {
      console.error("Failed to fetch leads:", err);
      showErrorAlert("Load Error", err?.response?.data?.message || "Failed to load lead inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/queries/${id}/status`, { status: newStatus });
      showSuccessAlert("Status Updated", `Lead status updated to ${newStatus}.`);
      fetchLeads();
      // Notify layout to refresh Bell Icon notification count instantly
      window.dispatchEvent(new Event("nexushub_lead_updated"));
    } catch (err: any) {
      showErrorAlert("Update Failed", err?.response?.data?.message || "Failed to update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.workspace?.name?.toLowerCase().includes(q) ||
      l.location?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 w-full font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">SUPER ADMIN CONTROL PANEL</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Customer Leads &amp; Queries</h1>
          <p className="text-xs text-slate-500 font-medium">Manage all nationwide member inquiries, booking leads, and tour requests.</p>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, city..."
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
            <option value="NEW">New Leads</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading Customer Lead Inquiries...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Customer Leads Found</h4>
            <p className="text-xs text-slate-400">Leads captured via website forms and popup will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Customer Details</th>
                  <th className="px-5 py-4">Requested Workspace / Hub</th>
                  <th className="px-5 py-4">Move-in &amp; Seats</th>
                  <th className="px-5 py-4">Inquiry Message</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <User className="w-3.5 h-3.5 text-amber-600" /> {lead.name}
                        {lead.message?.includes("[LIST YOUR SPACE") && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-extrabold text-[9px] uppercase tracking-wider">
                            Admin Partner Lead
                          </span>
                        )}
                        {(() => {
                          if (!lead.message?.includes("[LIST YOUR SPACE")) return null;
                          // Extract City from message
                          const match = lead.message.match(/- City:\s*([^\n\r]+)/i);
                          const leadCity = match ? match[1].trim() : "";
                          const existsInDb = dbLocations.some(
                            (l) => l.city?.toLowerCase() === leadCity.toLowerCase() || l.name?.toLowerCase() === leadCity.toLowerCase()
                          );
                          if (leadCity && !existsInDb) {
                            return (
                              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> New City Location: {leadCity}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {lead.email}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" /> +91 {lead.phone}
                      </div>
                    </td>

                    <td className="px-5 py-4 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {lead.workspace?.name || "General Workspace Inquiry"}
                      </div>
                      {(lead.location?.city || lead.location?.name) && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" /> {lead.location?.city || lead.location?.name}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 space-y-1 font-mono">
                      <div className="text-slate-900 font-bold">
                        📅 {lead.moveInDate || "Immediate"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        👥 {lead.seats || 1} Seat(s) Required
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-slate-600 leading-relaxed truncate-2-lines text-[11px]">
                        &ldquo;{lead.message}&rdquo;
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          lead.status === "CONVERTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : lead.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "CLOSED"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        ● {lead.status || "NEW"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <select
                        disabled={updatingId === lead._id}
                        value={lead.status || "NEW"}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="NEW">Set NEW</option>
                        <option value="CONTACTED">Mark Contacted</option>
                        <option value="CONVERTED">Mark Converted</option>
                        <option value="CLOSED">Close Lead</option>
                      </select>
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
