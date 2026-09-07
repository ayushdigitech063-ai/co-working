"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import WorkspaceFormModal from "@/components/WorkspaceFormModal";
import {
  Building2, Plus, Loader2, Image as ImageIcon
} from "lucide-react";

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Workspace Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkspaceForEdit, setSelectedWorkspaceForEdit] = useState<any>(null);

  const fetchWorkspaces = () => {
    setLoading(true);
    Promise.all([
      api.get("/workspaces", { params: { mySubmissions: true } }),
      api.get("/locations"),
      api.get("/workspace-types"),
    ])
      .then(([wsRes, locRes, typeRes]) => {
        const wsData = wsRes.data?.data;
        const wsList = Array.isArray(wsData) ? wsData : wsData?.content || [];
        setWorkspaces(wsList);

        const locData = locRes.data?.data;
        const locList = Array.isArray(locData) ? locData : locData?.content || [];
        setLocations(locList);

        const typeData = typeRes.data?.data;
        const typeList = Array.isArray(typeData) ? typeData : typeData?.content || [];
        setTypes(typeList);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">INVENTORY MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">My Regional Workspaces</h1>
          <p className="text-xs text-slate-500 mt-1">Manage workspace cabins &amp; submit new inventory with full specs, capacity, pricing &amp; amenities.</p>
        </div>
        <button
          onClick={() => {
            setSelectedWorkspaceForEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          + Submit New Workspace
        </button>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600 font-mono">
                <th className="px-6 py-4">Workspace &amp; Cover</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Monthly Price</th>
                <th className="px-6 py-4">Capacity &amp; Area</th>
                <th className="px-6 py-4">Gallery Views</th>
                <th className="px-6 py-4">Approval Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Fetching Workspaces...
                  </td>
                </tr>
              ) : workspaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No workspaces submitted yet. Click &quot;+ Submit New Workspace&quot; to add.
                  </td>
                </tr>
              ) : (
                workspaces.map((ws) => (
                  <tr key={ws._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-950 flex items-center gap-3">
                      <img
                        src={ws.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100"}
                        alt={ws.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      <div>
                        <span className="block font-bold text-slate-900">{ws.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{ws.workspaceType?.name || "Workspace"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{ws.location?.city || "Gurugram"}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">
                      ₹{ws.price?.toLocaleString("en-IN")}/{ws.pricingPeriod === "hour" ? "hr" : ws.pricingPeriod === "day" ? "day" : "mo"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{ws.capacity} Seats</div>
                      {ws.sqft && <div className="text-[10px] text-slate-400 font-mono">{ws.sqft} sq ft</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 font-bold text-[11px] text-slate-700">
                        🖼️ {ws.images?.length || 0} Interior Views
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          ws.approvalStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ws.approvalStatus === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {ws.approvalStatus || "APPROVED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedWorkspaceForEdit(ws);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WORKSPACE FORM MODAL COMPONENT */}
      <WorkspaceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkspaceForEdit(null);
        }}
        onSuccess={fetchWorkspaces}
        locations={locations}
        types={types}
        isSuperAdmin={false}
        initialData={selectedWorkspaceForEdit}
      />
    </div>
  );
}
