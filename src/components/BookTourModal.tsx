"use client";

import { useState } from "react";
import { X, Calendar, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { leadService } from "@/services/bookingService";

interface BookTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookTourModal({ isOpen, onClose }: BookTourModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Gurugram",
    preferredDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleaned = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    setLoading(true);
    try {
      await leadService.submit({
        name: form.name,
        email: form.email,
        phone: cleaned,
        message: `Book a Tour Enquiry - Preferred City: ${form.city}, Preferred Date: ${form.preferredDate}. Notes: ${form.notes}`,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit tour request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-neutral-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-brand-yellow text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono">Book a Private Tour</span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">Experience Sumit&apos;s Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-1.5">Tour Request Received!</h4>
              <p className="text-neutral-600 text-xs mb-5 leading-relaxed">
                Thank you for your interest! Our space expert will contact you shortly to confirm your visit to <strong>Sumit&apos;s Co-Working Space ({form.city})</strong>.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10 digits"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Select City
                  </label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer pr-7"
                    >
                      <option value="Gurugram">Gurugram</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. 5 Desks, Private Cabin"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center shadow-md mt-1"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Calendar className="w-3.5 h-3.5 mr-1.5" />}
                {loading ? "Scheduling Tour..." : "Confirm Tour Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
