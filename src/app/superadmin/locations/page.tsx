"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { MapPin, Plus, Upload, Trash2, Loader2, CheckCircle2, Building, Eye } from "lucide-react";
import { getIndianStates, getCitiesOfState, getAreasOfCity } from "@/constants/indianStates";

export default function SuperAdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    state: "Rajasthan",
    city: "Jaipur",
    area: "",
    address: "",
    description: "",
    imageUrl: "",
  });
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLocations = () => {
    setLoading(true);
    api.get("/locations")
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) setLocations(data);
        else if (data && Array.isArray(data.content)) setLocations(data.content);
        else setLocations([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      showSuccessAlert("Image Uploaded! 📸", "Location banner attached.");
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload location image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/locations", form);
      showSuccessAlert("Location Published! 🎉", "New location is now live on the homepage.");
      setForm({ name: "", state: "Rajasthan", city: "Jaipur", area: "", address: "", description: "", imageUrl: "" });
      setIsCustomArea(false);
      fetchLocations();
      setIsModalOpen(false);
    } catch (err: any) {
      showErrorAlert("Creation Failed", err?.response?.data?.message || "Failed to create location.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/locations/${id}`);
      showSuccessAlert("Location Deleted", "Removed from database.");
      fetchLocations();
    } catch (err: any) {
      showErrorAlert("Delete Failed", err?.response?.data?.message || "Failed to delete location.");
    }
  };

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono font-bold">SUPER ADMIN LOCATIONS</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Prime Locations &amp; Centres</h1>
          <p className="text-xs text-slate-500 mt-1">Manage prime business cities and centres with Cloudinary images &amp; addresses.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Add New Location
        </button>
      </div>

      {/* LOCATIONS GRID */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          Loading Live Locations...
        </div>
      ) : locations.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800">No Locations Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click '+ Add New Location' to publish your first prime business city/centre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={loc.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleDeleteLocation(loc._id)}
                      className="p-2 rounded-xl bg-black/60 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {loc.city}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 font-serif">{loc.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {loc.address || loc.city}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] font-bold text-amber-600">
                <span>● Active City</span>
                <span className="text-slate-400 font-normal">Live On Homepage</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD LOCATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono">LOCATION MANAGER</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Add Prime Location / Centre</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitLocation} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    State *
                  </label>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => {
                      const selectedSt = e.target.value;
                      const citiesList = getCitiesOfState(selectedSt);
                      setForm({
                        ...form,
                        state: selectedSt,
                        city: citiesList[0] || "",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {getIndianStates().map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City Name *
                  </label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      const areas = getAreasOfCity(selectedCity);
                      setIsCustomArea(false);
                      setForm({
                        ...form,
                        city: selectedCity,
                        area: areas[0] || "",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {getCitiesOfState(form.state).map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Area / Locality *
                  </label>
                  <div className="space-y-2">
                    <select
                      value={isCustomArea ? "custom" : form.area}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomArea(true);
                          setForm({ ...form, area: "" });
                        } else {
                          setIsCustomArea(false);
                          setForm({ ...form, area: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {getAreasOfCity(form.city).map((ar) => (
                        <option key={ar} value={ar}>
                          📍 {ar}
                        </option>
                      ))}
                      <option value="custom">✏️ Enter Custom Locality / Area...</option>
                    </select>

                    {isCustomArea && (
                      <input
                        type="text"
                        required
                        autoFocus
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        placeholder="Type your custom locality name..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400 bg-amber-50/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 animate-in fade-in"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Centre / Hub Title
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. NexusHub Executive Centre"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Plot 14, Main Commercial Belt, Sector 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Infrastructure &amp; Hub Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. State-of-the-art office infrastructure with gigabit fiber connectivity, soundproof meeting rooms, 24/7 security access, and premium corporate amenities."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* CLOUDINARY LOCATION IMAGE UPLOAD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Location Banner Image (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    {uploadingImage ? "Uploading..." : "Upload Location Image"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.imageUrl && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Banner Ready
                    </span>
                  )}
                </div>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Location Banner" className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-200" />
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                Publish Location Live
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
