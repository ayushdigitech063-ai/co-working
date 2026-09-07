"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import {
  Users, UserPlus, ShieldAlert, CheckCircle2, XCircle,
  Clock, Trash2, Search, Loader2, X, AlertTriangle
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  lastLoginAt?: string;
}

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create Admin Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // Action status loading ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admins", {
        params: { search, status: statusFilter },
      });
      setAdmins(res.data.data.admins);
      setStats(res.data.data.stats);
    } catch (err: any) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [search, statusFilter]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");
    setSubmitting(true);

    try {
      const res = await api.post("/admins", form);
      setModalSuccess("Admin account created! Credentials sent to their email.");
      setForm({ name: "", email: "", phone: "" });
      fetchAdmins();
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setModalSuccess("");
      }, 2000);
    } catch (err: any) {
      setModalError(err?.response?.data?.message || "Failed to create Admin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      await api.patch(`/admins/${id}/status`, { status: newStatus });
      fetchAdmins();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update admin status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete Admin "${name}"?`)) return;
    setActionLoadingId(id);
    try {
      await api.delete(`/admins/${id}`);
      fetchAdmins();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete admin.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Super Admin Control</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-950 mt-1">Admin Management</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          Create Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Admins</div>
          <div className="text-3xl font-bold text-neutral-950 mt-2">{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Admins</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</div>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Inactive Admins</div>
          <div className="text-3xl font-bold text-amber-600 mt-2">{stats.inactive}</div>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Suspended Admins</div>
          <div className="text-3xl font-bold text-rose-600 mt-2">{stats.suspended}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === "" ? "bg-neutral-950 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === "ACTIVE" ? "bg-emerald-600 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("SUSPENDED")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === "SUSPENDED" ? "bg-rose-600 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            Suspended
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-600">
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading Admin Accounts...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                        {adm.name.charAt(0).toUpperCase()}
                      </div>
                      {adm.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{adm.email}</td>
                    <td className="px-6 py-4 text-neutral-500">{adm.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          adm.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : adm.status === "SUSPENDED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(adm.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {actionLoadingId === adm._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400 ml-auto" />
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {adm.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleStatusChange(adm._id, "SUSPENDED")}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition text-[11px]"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(adm._id, "ACTIVE")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition text-[11px]"
                            >
                              Activate
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAdmin(adm._id, adm.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMIN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">SUPER ADMIN ACTION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Create New Admin</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {modalError && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{modalError}</div>}
              {modalSuccess && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">{modalSuccess}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@nexushub.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <p className="text-[11px] text-neutral-400 bg-stone-50 p-3 rounded-xl border border-neutral-100">
                🔐 Temporary password will be automatically generated and emailed to the Admin along with login instructions.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
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
