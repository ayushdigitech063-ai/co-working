"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import WorkspaceFormModal from "@/components/WorkspaceFormModal";
import {
  Building2, MapPin, Search, Loader2, CheckCircle2, Clock, X, Eye, ThumbsUp, ThumbsDown, Users, Image as ImageIcon, Plus, Trash2, Edit3
} from "lucide-react";

export default function SuperAdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Create & Edit Workspace Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);

  const fetchWorkspaces = () => {
    setLoading(true);
    Promise.all([
      api.get("/workspaces"),
      api.get("/locations"),
      api.get("/workspace-types"),
    ])
      .then(([wsRes, locRes, typeRes]) => {
        const data = wsRes.data.data;
        if (Array.isArray(data)) setWorkspaces(data);
        else if (data && Array.isArray(data.content)) setWorkspaces(data.content);
        else setWorkspaces([]);

        const locsData = locRes.data.data;
        const locList = Array.isArray(locsData) ? locsData : locsData?.content || [];
        setLocations(locList);

        const typesData = typeRes.data.data;
        const typeList = Array.isArray(typesData) ? typesData : typesData?.content || [];
        setTypes(typeList);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Lock background body scroll when inspection modal is open
  useEffect(() => {
    if (selectedWorkspace) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedWorkspace]);

  const handleApproveWorkspace = async (id: string) => {
    try {
      await api.patch(`/approvals/workspace/${id}/approve`);
      showSuccessAlert("Workspace Approved! 🎉", "The workspace is now live on the public portal.");
      fetchWorkspaces();
      if (selectedWorkspace?._id === id) setSelectedWorkspace(null);
    } catch (err: any) {
      showErrorAlert("Approval Failed", err?.response?.data?.message || "Failed to approve workspace.");
    }
  };

  const handleRejectWorkspace = async (id: string) => {
    try {
      await api.patch(`/approvals/workspace/${id}/reject`, { reason: "Needs updated specifications/images" });
      showSuccessAlert("Workspace Rejected", "The regional admin has been notified.");
      fetchWorkspaces();
      if (selectedWorkspace?._id === id) setSelectedWorkspace(null);
    } catch (err: any) {
      showErrorAlert("Rejection Failed", err?.response?.data?.message || "Failed to reject workspace.");
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workspace inventory?")) return;
    try {
      await api.delete(`/workspaces/${id}`);
      showSuccessAlert("Workspace Deleted", "Inventory removed permanently.");
      fetchWorkspaces();
      if (selectedWorkspace?._id === id) setSelectedWorkspace(null);
    } catch (err: any) {
      showErrorAlert("Delete Failed", err?.response?.data?.message || "Failed to delete workspace.");
    }
  };

  const filteredWorkspaces = workspaces.filter((ws) => {
    if (activeTab === "ALL") return true;
    return (ws.approvalStatus || "APPROVED") === activeTab;
  });

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">SUPER ADMIN CONTROL PANEL</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Workspace Inventory &amp; Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">Manage, add new properties, &amp; inspect regional admin submissions with full specs &amp; 6 gallery views.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingWorkspace(null);
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            + Add New Workspace
          </button>

          {/* Tab Filters */}
          <div className="flex items-center gap-1 bg-slate-200/60 p-1.5 rounded-2xl">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === tab ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKSPACE CARDS GRID */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          Loading Workspaces Grid...
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800">No Workspaces Found</h3>
          <p className="text-xs text-slate-400 mt-1">No workspaces match the selected {activeTab} status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((ws) => (
            <div
              key={ws._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
            >
              {/* Cover Photo */}
              <div
                onClick={() => setSelectedWorkspace(ws)}
                className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={ws.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"}
                  alt={ws.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ws.approvalStatus === "APPROVED"
                        ? "bg-emerald-500 text-white shadow-md"
                        : ws.approvalStatus === "REJECTED"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-amber-500 text-slate-950 shadow-md animate-pulse"
                    }`}
                  >
                    {ws.approvalStatus || "APPROVED"}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 font-mono">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  {ws.images?.length || 0} Gallery Views
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider font-mono">
                      {ws.workspaceType?.name || "Private Office"}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      {ws.capacity} Seats {ws.sqft ? `• ${ws.sqft} sq ft` : ""}
                    </span>
                  </div>
                  <h3
                    onClick={() => setSelectedWorkspace(ws)}
                    className="font-serif font-bold text-lg text-slate-900 mt-1 line-clamp-1 group-hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    {ws.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    {ws.location?.name || ws.location?.city || "Prime Business Hub"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
                      RENT ({ws.pricingPeriod === "hour" ? "PER HR" : ws.pricingPeriod === "day" ? "PER DAY" : "MONTHLY"})
                    </span>
                    <span className="text-base font-black text-slate-900">₹{ws.price?.toLocaleString("en-IN") || 0}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingWorkspace(ws);
                        setIsCreateModalOpen(true);
                      }}
                      title="Edit Details"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedWorkspace(ws)}
                      className="px-3 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECTION MODAL FOR SUPER ADMIN */}
      {selectedWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                  INVENTORY INSPECTION &bull; {selectedWorkspace.approvalStatus}
                </span>
                <h3 className="text-2xl font-serif font-bold mt-0.5">{selectedWorkspace.name}</h3>
              </div>
              <button onClick={() => setSelectedWorkspace(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Price</span>
                  <span className="font-extrabold text-slate-950 text-base">₹{selectedWorkspace.price?.toLocaleString("en-IN")}/mo</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Capacity &amp; Sqft</span>
                  <span className="font-extrabold text-slate-950 text-base">{selectedWorkspace.capacity} Seats {selectedWorkspace.sqft ? `(${selectedWorkspace.sqft} sq ft)` : ""}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Contact Call</span>
                  <span className="font-bold text-amber-600">{selectedWorkspace.callNumber || "1800 123 77888"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">WhatsApp</span>
                  <span className="font-bold text-emerald-600">{selectedWorkspace.whatsappNumber || "8385973582"}</span>
                </div>
              </div>

              {/* Description & Amenities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Description</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedWorkspace.description || "No description provided."}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2 font-mono">Included Corporate Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedWorkspace.amenities && selectedWorkspace.amenities.length > 0
                    ? selectedWorkspace.amenities
                    : ["High-Speed Fiber Wi-Fi", "Air Conditioning", "Tea/Coffee", "Printing"]
                  ).map((a: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-bold text-slate-800 border border-slate-200/80">
                      ✨ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">6 Property Gallery Views</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(selectedWorkspace.images && selectedWorkspace.images.length > 0 ? selectedWorkspace.images : [selectedWorkspace.imageUrl]).map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-200">
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteWorkspace(selectedWorkspace._id)}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Inventory
                </button>

                <div className="flex items-center gap-3">
                  {selectedWorkspace.approvalStatus === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleRejectWorkspace(selectedWorkspace._id)}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition flex items-center gap-1.5"
                      >
                        <ThumbsDown className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveWorkspace(selectedWorkspace._id)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md"
                      >
                        <ThumbsUp className="w-4 h-4" /> Approve &amp; Publish Live
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN WORKSPACE FORM MODAL COMPONENT */}
      <WorkspaceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingWorkspace(null);
        }}
        onSuccess={fetchWorkspaces}
        locations={locations}
        types={types}
        isSuperAdmin={true}
        initialData={editingWorkspace}
      />
    </div>
  );
}
