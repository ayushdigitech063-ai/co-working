"use client";

import { useState } from "react";
import { X, Building2, User, Mail, Phone, MapPin, Briefcase, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { leadService } from "@/services/bookingService";

interface ListYourSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListYourSpaceModal({ isOpen, onClose }: ListYourSpaceModalProps) {
  const [form, setForm] = useState({
    adminName: "",
    email: "",
    phone: "",
    companyName: "",
    city: "",
    areaLocation: "",
    totalDesks: "",
    propertyType: "Commercial Building",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    setLoading(true);
    try {
      const adminLeadMessage = `[LIST YOUR SPACE - ADMIN PARTNER LEAD]
Property Details:
- Company/Brand: ${form.companyName || "N/A"}
- City: ${form.city}
- Area/Locality: ${form.areaLocation}
- Total Seats/Desks Capacity: ${form.totalDesks || "Not specified"}
- Property Type: ${form.propertyType}
- Admin Notes: ${form.notes || "Interested in listing workspace property on NexusHub."}`;

      await leadService.submit({
        name: form.adminName,
        email: form.email,
        phone: cleanedPhone,
        message: adminLeadMessage,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-neutral-950 text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Partner Workspace Network</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mt-1">List Your Coworking Space</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Submit your workspace information for review and onboarding.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm font-sans space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">
                      Workspace submitted for review
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Your workspace details have been successfully submitted. You'll be notified once your workspace is approved.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  Under Review
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
                >
                  Close Window
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm"
                >
                  View Submission Status
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Admin Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.adminName}
                      onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="admin@workspace.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setForm({ ...form, phone: val });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  {form.phone.length > 0 && form.phone.length < 10 && (
                    <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">
                      Enter {10 - form.phone.length} more digit(s)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Workspace / Brand Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Apex Workspaces"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurugram, Mumbai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Area / Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber City, BKC"
                    value={form.areaLocation}
                    onChange={(e) => setForm({ ...form, areaLocation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Total Seats / Capacity
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 50 Seats / 2 Floors"
                      value={form.totalDesks}
                      onChange={(e) => setForm({ ...form, totalDesks: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer bg-white"
                  >
                    <option value="Commercial Building">Commercial Building</option>
                    <option value="Standalone Hub">Standalone Hub</option>
                    <option value="IT Park Tower">IT Park Tower</option>
                    <option value="Boutique Office">Boutique Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Additional Admin / Space Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention key details about your workspace amenities, pricing model, or preferred contact time..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Premium SaaS Workspace Submission Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm mt-6 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Left Side Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                        Ready to list your space?
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
                        Submit your details to our team. We will review your property information and get in touch to complete onboarding.
                      </p>
                    </div>
                  </div>

                  {/* Right Side Action */}
                  <div className="flex flex-col items-start sm:items-end shrink-0 gap-1.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Details
                          <span className="text-amber-400 font-normal text-sm ml-0.5">&rarr;</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Our team usually responds within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
