"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/utils/swal";
import {
  Users, UserPlus, ShieldAlert, CheckCircle2, XCircle,
  Clock, Trash2, Search, Loader2, X, AlertTriangle, Edit3, MapPin
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  region?: string;
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
  const [createState, setCreateState] = useState("Rajasthan");
  const [createCity, setCreateCity] = useState("Jaipur");
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "", region: "Jaipur (jamdoli) — Rajasthan" });
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Edit Admin Modal State
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", region: "Gurugram", status: "ACTIVE" });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Action loading ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [locations, setLocations] = useState<any[]>([]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isCreateModalOpen || editingAdmin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCreateModalOpen, editingAdmin]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const [admRes, locRes] = await Promise.all([
        api.get("/admin-management", { params: { search, status: statusFilter } }),
        api.get("/locations"),
      ]);
      setAdmins(admRes.data.data.admins);
      setStats(admRes.data.data.stats);

      const locsData = locRes.data.data;
      const locList = Array.isArray(locsData) ? locsData : locsData?.content || [];
      setLocations(locList);
      if (locList.length > 0) {
        const firstLoc = locList[0];
        const st = firstLoc.state || "Rajasthan";
        const ct = firstLoc.city || firstLoc.name;
        const area = firstLoc.area || firstLoc.name;
        setCreateState(st);
        setCreateCity(ct);
        setCreateForm((f) => ({ ...f, region: `${ct} (${area}) — ${st}` }));
      }
    } catch (err: any) {
      console.error("Failed to fetch admins or locations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [search, statusFilter]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setSubmittingCreate(true);

    try {
      await api.post("/admin-management", createForm);

      showSuccessAlert(
        "Admin Account Created! 🎉",
        `Login credentials and password setup link have been emailed directly to ${createForm.email}.`
      );

      setCreateForm({ name: "", email: "", phone: "", region: "Gurugram" });
      fetchAdmins();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create Admin.";
      setCreateError(msg);
      showErrorAlert("Creation Failed", msg);
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleEditClick = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setEditForm({
      name: adm.name,
      phone: adm.phone || "",
      region: adm.region || "Gurugram",
      status: adm.status,
    });
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setSubmittingEdit(true);
    try {
      await api.patch(`/admin-management/${editingAdmin._id}/status`, { status: editForm.status });
      showSuccessAlert("Admin Updated", `Status updated to ${editForm.status}.`);
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      showErrorAlert("Update Failed", err?.response?.data?.message || "Failed to update admin.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await showConfirmAlert(
      `${newStatus === "SUSPENDED" ? "Suspend" : "Activate"} Admin?`,
      `Are you sure you want to change this Admin's status to ${newStatus}?`,
      `Yes, ${newStatus.toLowerCase()} account`
    );

    if (!res.isConfirmed) return;

    setActionLoadingId(id);
    try {
      await api.patch(`/admin-management/${id}/status`, { status: newStatus });
      showSuccessAlert("Status Changed", `Admin status is now ${newStatus}.`);
      fetchAdmins();
    } catch (err: any) {
      showErrorAlert("Action Failed", err?.response?.data?.message || "Failed to update status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    const res = await showConfirmAlert(
      "Delete Admin Account?",
      `Are you sure you want to permanently delete Admin "${name}"? This action cannot be undone.`,
      "Yes, Delete Admin"
    );

    if (!res.isConfirmed) return;

    setActionLoadingId(id);
    try {
      await api.delete(`/admin-management/${id}`);
      showSuccessAlert("Admin Deleted", `Admin "${name}" was permanently removed.`);
      fetchAdmins();
    } catch (err: any) {
      showErrorAlert("Deletion Failed", err?.response?.data?.message || "Failed to delete admin.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Super Admin Control</span>
          <h1 className="text-3xl font-serif font-bold text-neutral-950 mt-1">Admin Management &amp; Access Control</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4.5 h-4.5 text-amber-400" />
          + Create Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Admins</div>
          <div className="text-4xl font-extrabold text-neutral-950 mt-2">{stats.total}</div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Admins</div>
          <div className="text-4xl font-extrabold text-emerald-600 mt-2">{stats.active}</div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Inactive Admins</div>
          <div className="text-4xl font-extrabold text-amber-600 mt-2">{stats.inactive}</div>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Suspended Admins</div>
          <div className="text-4xl font-extrabold text-rose-600 mt-2">{stats.suspended}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search admin by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-neutral-200 bg-stone-50 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              statusFilter === "" ? "bg-neutral-950 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              statusFilter === "ACTIVE" ? "bg-emerald-600 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("SUSPENDED")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              statusFilter === "SUSPENDED" ? "bg-rose-600 text-white" : "bg-stone-100 text-neutral-600 hover:bg-stone-200"
            }`}
          >
            Suspended
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-600">
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching Admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-950 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {adm.name.charAt(0).toUpperCase()}
                      </div>
                      {adm.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">{adm.email}</td>
                    <td className="px-6 py-4 text-neutral-500">{adm.phone || "N/A"}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {adm.region || "Gurugram"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
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
                          <button
                            onClick={() => handleEditClick(adm)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-neutral-700 transition"
                            title="Edit Admin Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {adm.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleStatusChange(adm._id, "SUSPENDED")}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition text-[11px]"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(adm._id, "ACTIVE")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition text-[11px]"
                            >
                              Activate
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAdmin(adm._id, adm.name)}
                            className="p-2 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* CREATE ADMIN MODAL DIALOG */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">SUPER ADMIN ACTION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Create New Admin Account</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {createError && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{createError}</div>}
              {createSuccess && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">{createSuccess}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
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
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="admin@nexushub.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 3-STEP CASCADING REGION ASSIGNMENT (STATE -> CITY -> HUB/AREA) */}
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-neutral-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block font-mono">
                  ASSIGNED REGION / LOCATION (STATE &bull; CITY &bull; HUB) *
                </span>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        State *
                      </label>
                      <select
                        value={createState}
                        onChange={(e) => {
                          const newSt = e.target.value;
                          setCreateState(newSt);
                          const stateLocs = locations.filter((l: any) => (l.state || "Rajasthan") === newSt);
                          const cities = Array.from(new Set(stateLocs.map((l: any) => l.city || l.name).filter(Boolean)));
                          const firstCity = cities[0] || "";
                          setCreateCity(firstCity);
                          const hubs = stateLocs.filter((l: any) => (l.city || l.name) === firstCity);
                          const defaultArea = hubs[0]?.area || hubs[0]?.name || "Central Hub";
                          setCreateForm((f) => ({ ...f, region: `${firstCity} (${defaultArea}) — ${newSt}` }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {Array.from(new Set(locations.map((l: any) => l.state || "Rajasthan").filter(Boolean))).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        City *
                      </label>
                      <select
                        value={createCity}
                        onChange={(e) => {
                          const newCt = e.target.value;
                          setCreateCity(newCt);
                          const hubs = locations.filter((l: any) => (l.state || "Rajasthan") === createState && (l.city || l.name) === newCt);
                          const defaultArea = hubs[0]?.area || hubs[0]?.name || "Central Hub";
                          setCreateForm((f) => ({ ...f, region: `${newCt} (${defaultArea}) — ${createState}` }));
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        {Array.from(
                          new Set(
                            locations
                              .filter((l: any) => (l.state || "Rajasthan") === createState)
                              .map((l: any) => l.city || l.name)
                              .filter(Boolean)
                          )
                        ).map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Centre / Hub Area *
                    </label>
                    <select
                      value={createForm.region}
                      onChange={(e) => setCreateForm({ ...createForm, region: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {locations
                        .filter((l: any) => (l.state || "Rajasthan") === createState && (l.city || l.name) === createCity)
                        .map((loc: any) => {
                          const regValue = `${loc.city} (${loc.area || loc.name}) — ${loc.state}`;
                          return (
                            <option key={loc._id} value={regValue}>
                              📍 {loc.city} ({loc.area || loc.name}) — {loc.state}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="9876543210 (10 digits)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <p className="text-[11px] text-neutral-500 bg-stone-50 p-3 rounded-xl border border-neutral-200">
                🔐 Temporary password will be generated automatically and emailed to the Admin with login instructions.
              </p>

              <button
                type="submit"
                disabled={submittingCreate}
                className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submittingCreate ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-amber-400" />}
                {submittingCreate ? "Creating Admin & Emailing..." : "Create Admin Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL DIALOG */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
            <div className="bg-neutral-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">EDIT ADMIN DETAILS</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">{editingAdmin.email}</h3>
              </div>
              <button onClick={() => setEditingAdmin(null)} className="p-1 rounded-full text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Account Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex-1 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
