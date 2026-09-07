"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import {
  CheckSquare, Check, X, Clock, AlertCircle,
  Building2, MapPin, Eye, Loader2, MessageSquare
} from "lucide-react";

interface ApprovalItem {
  _id: string;
  entityType: string;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedBy: { name: string; email: string };
  rejectionReason?: string;
  proposedChanges?: any;
  createdAt: string;
}

export default function SuperAdminApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("PENDING");

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState<ApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  // Action status loading ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/approvals", {
        params: { status: tab === "ALL" ? "" : tab },
      });
      setApprovals(res.data.data.content);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [tab]);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await api.post(`/approvals/${id}/approve`);
      fetchApprovals();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to approve content.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem || !rejectionReason.trim()) return;

    setSubmittingReject(true);
    try {
      await api.post(`/approvals/${rejectingItem._id}/reject`, {
        rejectionReason,
      });
      setRejectingItem(null);
      setRejectionReason("");
      fetchApprovals();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject content.");
    } finally {
      setSubmittingReject(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Workflow Approval Engine</span>
        <h1 className="text-3xl font-serif font-bold text-neutral-950 mt-1">Content Approvals</h1>
        <p className="text-xs text-neutral-500 mt-1">Review Admin-submitted content before publishing live on public site.</p>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t
                ? "bg-neutral-950 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-stone-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-600">
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Requested Action</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching approval queue...
                  </td>
                </tr>
              ) : approvals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    No approval requests in {tab.toLowerCase()} queue.
                  </td>
                </tr>
              ) : (
                approvals.map((app) => (
                  <tr key={app._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{app.submittedBy?.name || "Admin"}</div>
                      <div className="text-[11px] text-neutral-400">{app.submittedBy?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-800">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-neutral-200 text-neutral-700">
                        {app.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span
                        className={`text-[11px] uppercase tracking-wider ${
                          app.action === "CREATE"
                            ? "text-blue-600"
                            : app.action === "UPDATE"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {app.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {actionLoadingId === app._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400 ml-auto" />
                      ) : app.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(app._id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition text-[11px] flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingItem(app)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition text-[11px] flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-semibold italic">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
            <div className="bg-rose-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">REJECTION ACTION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Reject Submission</h3>
              </div>
              <button onClick={() => setRejectingItem(null)} className="p-1 rounded-full text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide constructive feedback for the Admin..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submittingReject ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
