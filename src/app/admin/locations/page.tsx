"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { MapPin, Plus, Loader2, X, Building2 } from "lucide-react";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Location Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "Gurugram",
    address: "",
    description: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchLocations = () => {
    setLoading(true);
    api.get("/locations")
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setLocations(data);
        } else if (data && Array.isArray(data.content)) {
          setLocations(data.content);
        } else {
          setLocations([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmitLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/locations", form);
      showSuccessAlert(
        "Location Submitted! 📍",
        "Your new location has been submitted for Super Admin review before publishing."
      );
      fetchLocations();
      setIsModalOpen(false);
    } catch (err: any) {
      showErrorAlert("Submission Failed", err?.response?.data?.message || "Failed to submit location.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">LOCATION MANAGEMENT</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Centres &amp; Locations</h1>
          <p className="text-xs text-slate-500 mt-1">View active coworking hubs &amp; submit new location proposals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          + Submit New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading Locations...
          </div>
        ) : !Array.isArray(locations) || locations.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            No locations recorded yet. Click &quot;+ Submit New Location&quot; to add.
          </div>
        ) : (
          locations.map((loc) => (
            <div key={loc._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{loc.name}</h3>
                  <span className="text-xs font-semibold text-slate-400">{loc.city}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{loc.address}</p>
            </div>
          ))
        )}
      </div>

      {/* SUBMIT LOCATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">CONTENT SUBMISSION</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Submit New Location</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLocation} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Centre Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cyber City Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Gurugram">Gurugram</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Address Details *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Building 10, DLF Cyber City, Sector 24"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-amber-400" />}
                {submitting ? "Submitting Location..." : "Submit Location for Approval"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
