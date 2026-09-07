"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import {
  Building2, MapPin, CalendarCheck, MessageSquare,
  TrendingUp, Clock, ShieldCheck, ArrowRight, Loader2,
  Plus, CheckCircle2, ChevronDown, Layers, FileText, UploadCloud, X
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Submit Workspace Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [modalState, setModalState] = useState<string>("Haryana");
  const [modalCity, setModalCity] = useState<string>("Panipat");
  const [form, setForm] = useState({
    name: "",
    workspaceType: "",
    location: "",
    price: "",
    capacity: "1",
    description: "",
    imageUrl: "",
    amenities: "WiFi, AC, Tea/Coffee, Printing",
  });

  // Multi-Image Gallery State (Up to 6 views)
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminStats = () => {
    setLoading(true);
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/approvals"),
      api.get("/workspaces?adminScope=true"),
      api.get("/locations"),
      api.get("/workspace-types"),
    ])
      .then(([dashRes, appRes, workRes, locRes, typeRes]) => {
        setStats({
          bookingStats: dashRes.data.data,
          submissions: appRes.data.data.content || [],
          workspaces: workRes.data.data.content || [],
        });

        const locsData = locRes.data.data;
        const locList = Array.isArray(locsData) ? locsData : locsData?.content || [];
        setLocations(locList);

        const typesData = typeRes.data.data;
        const typeList = Array.isArray(typesData) ? typesData : typesData?.content || [];
        setTypes(typeList);

        if (locList.length > 0) {
          const firstLoc = locList[0];
          const initSt = firstLoc.state || "Haryana";
          const initCt = firstLoc.city || "Panipat";
          setModalState(initSt);
          setModalCity(initCt);
          setForm((f) => ({ ...f, location: firstLoc._id }));
        }
        if (typeList.length > 0) setForm((f) => ({ ...f, workspaceType: typeList[0]._id }));
      })
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  // Main Cover Image Cloudinary Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      showSuccessAlert("Main Image Uploaded! 📸", "Front cover image uploaded successfully.");
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingMain(false);
    }
  };

  // Up to 6 Inside Gallery Views Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (galleryImages.length + files.length > 6) {
      showErrorAlert("Limit Exceeded", "You can upload a maximum of 6 inside gallery images.");
      return;
    }

    setUploadingGallery(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await api.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGalleryImages((prev) => [...prev, ...res.data.urls]);
      showSuccessAlert("Gallery Uploaded! 🖼️", `${res.data.urls.length} interior view(s) uploaded successfully.`);
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        ...form,
        images: galleryImages,
        price: Number(form.price),
        capacity: Number(form.capacity),
        amenities: form.amenities.split(",").map((s) => s.trim()),
      };

      if (!payload.location || payload.location.length !== 24) {
        delete payload.location;
      }
      if (!payload.workspaceType || payload.workspaceType.length !== 24) {
        delete payload.workspaceType;
      }

      await api.post("/workspaces", payload);

      showSuccessAlert(
        "Workspace Submitted! 🚀",
        "Your workspace with 6 interior views has been submitted for Super Admin approval before going live."
      );
      setForm({
        name: "",
        workspaceType: types[0]?._id || "",
        location: locations[0]?._id || "",
        price: "",
        capacity: "1",
        description: "",
        imageUrl: "",
        amenities: "WiFi, AC, Tea/Coffee, Printing",
      });
      setGalleryImages([]);
      fetchAdminStats();
      setIsSubmitModalOpen(false);
    } catch (err: any) {
      showErrorAlert("Submission Failed", err?.response?.data?.message || "Failed to submit workspace.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-9 h-9 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading Regional Admin Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full font-sans">
      {/* Welcome Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Admin"} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your regional workspaces, track member bookings, and submit content for Super Admin approval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            + Submit New Workspace
          </button>

          <Link
            href="/admin/submissions"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            My Submissions
          </Link>
        </div>
      </div>

      {/* 4 HIGH-END STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-slate-900">{stats?.bookingStats?.total || 0}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</div>
            <div className="text-[11px] font-bold text-purple-600 mt-1 flex items-center gap-1">
              <span>● Total Reservations</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-amber-600">
              {stats?.submissions?.filter((s: any) => s.status === "PENDING").length || 0}
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</div>
            <div className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>● Action Required</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Workspaces */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-slate-900">{stats?.workspaces?.length || 0}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Inventory</div>
            <div className="text-[11px] font-bold text-blue-600 mt-1 flex items-center gap-1">
              <span>● Available Spaces</span>
            </div>
          </div>
        </div>

        {/* Card 4: Regional Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              ₹
            </div>
            <span className="text-2xl font-black text-slate-900">
              ₹{(stats?.bookingStats?.totalRevenue || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regional Revenue</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span>● Platform Earnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK MANAGEMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/admin/workspaces"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Manage Workspaces</h3>
              <p className="text-[11px] text-slate-400">Inventory &amp; Cabins</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/locations"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Manage Locations</h3>
              <p className="text-[11px] text-slate-400">Centres &amp; Addresses</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/queries"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">View Queries</h3>
              <p className="text-[11px] text-slate-400">Customer Inquiries</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/submissions"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Submissions Status</h3>
              <p className="text-[11px] text-slate-400">Approval Queue</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* RECENT SUBMISSIONS STATUS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">My Recent Content Submissions</h3>
            <p className="text-xs text-slate-400">Status of content created/edited by you requiring Super Admin approval</p>
          </div>
          <Link href="/admin/submissions" className="text-xs font-bold text-amber-600 hover:underline">
            View All Submissions &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Entity Type</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stats?.submissions?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No submissions pending approval.
                  </td>
                </tr>
              ) : (
                stats?.submissions?.slice(0, 5).map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{sub.entityType}</td>
                    <td className="px-4 py-3 font-bold text-amber-600 uppercase">{sub.action}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : sub.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBMIT WORKSPACE MODAL WITH CLOUDINARY MULTI-IMAGE UPLOADER */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">CONTENT SUBMISSION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Submit New Workspace</h3>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWorkspace} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Workspace Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Executive Private Cabin 101"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 3-STEP CASCADING LOCATION SELECTORS (STATE -> CITY -> AREA/HUB) */}
              <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-slate-200/70">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
                  LOCATION REGION (STATE &bull; CITY &bull; HUB) *
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      State *
                    </label>
                    <select
                      value={modalState}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setModalState(newSt);
                        const cities = Array.from(new Set(locations.filter((l: any) => (l.state || "Rajasthan") === newSt).map((l: any) => l.city || l.name).filter(Boolean)));
                        const firstCity = cities[0] || "";
                        setModalCity(firstCity);
                        const hubs = locations.filter((l: any) => (l.state || "Rajasthan") === newSt && (l.city || l.name) === firstCity);
                        if (hubs.length > 0) setForm((f) => ({ ...f, location: hubs[0]._id }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {Array.from(new Set(locations.map((l: any) => l.state || "Rajasthan").filter(Boolean))).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      City *
                    </label>
                    <select
                      value={modalCity}
                      onChange={(e) => {
                        const newCt = e.target.value;
                        setModalCity(newCt);
                        const hubs = locations.filter((l: any) => (l.state || "Rajasthan") === modalState && (l.city || l.name) === newCt);
                        if (hubs.length > 0) setForm((f) => ({ ...f, location: hubs[0]._id }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {Array.from(
                        new Set(
                          locations
                            .filter((l: any) => (l.state || "Rajasthan") === modalState)
                            .map((l: any) => l.city || l.name)
                            .filter(Boolean)
                        )
                      ).map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Centre / Hub *
                    </label>
                    <select
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {locations
                        .filter((l: any) => (l.state || "Rajasthan") === modalState && (l.city || l.name) === modalCity)
                        .map((loc: any) => (
                          <option key={loc._id} value={loc._id}>
                            📍 {loc.area || loc.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Workspace Type *
                </label>
                <select
                  value={form.workspaceType}
                  onChange={(e) => setForm({ ...form, workspaceType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {!Array.isArray(types) || types.length === 0 ? (
                    <option value="">Private Office</option>
                  ) : (
                    types.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price (INR / Month) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 📸 MAIN FRONT VIEW COVER IMAGE (CLOUDINARY) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Main Front Cover View Image *
                </label>
                <div className="flex items-center gap-4">
                  {form.imageUrl ? (
                    <div className="relative w-24 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                      <img src={form.imageUrl} alt="Front View" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: "" })}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-amber-500 transition cursor-pointer text-center">
                      {uploadingMain ? (
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-amber-600 mb-1" />
                          <span className="text-xs font-bold text-slate-900">Upload Main Front Cover Image</span>
                          <span className="text-[10px] text-slate-400">JPG, PNG, WebP (High Resolution)</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* 🖼️ UP TO 6 INSIDE / INTERIOR GALLERY VIEWS (CLOUDINARY) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Inside Gallery Views (Up to 6 Images) *
                  </label>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {galleryImages.length} / 6 Uploaded
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Upload views: Front View, Back View, Inside Workstation, Meeting Room, Breakout Zone, Cafeteria View.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                  {galleryImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                      <img src={url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {galleryImages.length < 6 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-amber-500 transition flex flex-col items-center justify-center cursor-pointer text-center p-2">
                      {uploadingGallery ? (
                        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-600">Add View</span>
                        </>
                      )}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                    </label>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
                ⏳ Workspace with front cover &amp; 6 interior gallery views will be submitted as <strong>PENDING</strong> for Super Admin approval before going live.
              </p>

              <button
                type="submit"
                disabled={submitting || !form.imageUrl}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-amber-400" />}
                {submitting ? "Submitting Workspace..." : "Submit Workspace with Gallery"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
