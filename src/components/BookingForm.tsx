"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Loader2, CalendarDays, ShieldCheck, CheckCircle2, MessageCircle, PhoneCall, Send, User, Mail, Phone, X, Users, MapPin } from "lucide-react";

interface BookingFormProps {
  workspace?: any;
  workspaceId?: string;
  workspaceName?: string;
  pricePerMonth?: number;
  available?: boolean;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function BookingForm(props: BookingFormProps) {
  const { user } = useAuth();

  // Normalize props
  const workspace = props.workspace || {};
  const workspaceId = workspace._id || props.workspaceId || "";
  const workspaceName = workspace.name || props.workspaceName || "Workspace";
  const pricePerMonth = workspace.price || props.pricePerMonth || 0;
  const locationId = workspace.location?._id || workspace.location || "";
  const available = workspace.available !== undefined ? workspace.available : (props.available !== undefined ? props.available : true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    moveInDate: new Date().toISOString().split("T")[0],
    seats: "1",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Lock background page scroll on Modal Open
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

  const whatsappNumber = "8385973582";
  const whatsappMessage = encodeURIComponent(
    `Hello NexusHub India! 👋\nI just submitted an inquiry for workspace:\n📌 Workspace: *${workspaceName}*\n💰 Rent: *${formatCurrency(pricePerMonth)}/month*\n\nPlease confirm availability details!`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/queries", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        moveInDate: form.moveInDate,
        seats: Number(form.seats),
        message: form.message || `Interested in booking ${workspaceName} (${formatCurrency(pricePerMonth)}/month)`,
        workspaceId,
        locationId,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register inquiry lead. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* SIDEBAR CONTAINER CARD */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl p-6 sm:p-7 space-y-6 font-sans">
        {/* PRICE BANNER */}
        <div className="border-b border-neutral-100 pb-5 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 font-mono">RESERVATION RATE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-950 tracking-tight">{formatCurrency(pricePerMonth)}</span>
            <span className="text-xs text-neutral-500 font-medium">/ Month (excl. GST)</span>
          </div>
        </div>

        {/* PRIMARY PROCEED BUTTON (OPENS LEAD CAPTURE MODAL) */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setError("");
              setSuccess(false);
              setIsModalOpen(true);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Proceed &amp; Request Booking Lead</span>
          </button>

          {/* SECONDARY WHATSAPP ACTION BUTTON */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Chat Directly on WhatsApp</span>
          </a>

          <a
            href={`tel:${whatsappNumber}`}
            className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-neutral-200/80"
          >
            <PhoneCall className="w-4 h-4 text-amber-600" />
            <span>Call Desk: +91 8385973582</span>
          </a>
        </div>

        <p className="text-[11px] text-center text-neutral-400 font-medium flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Super Admin &amp; Space Manager Notified Instantly</span>
        </p>
      </div>

      {/* LEAD CAPTURE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden">
            {/* MODAL HEADER */}
            <div className="bg-neutral-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">RESERVATION INQUIRY</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Proceed with Workspace Lead</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-bold text-neutral-950">Inquiry Lead Submitted! 🎉</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                    Your reservation lead for <strong>{workspaceName}</strong> has been logged in the system.
                    Both **Super Admin** &amp; the **Workspace Manager** have been notified and will contact you shortly.
                  </p>
                </div>

                <div className="pt-3 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Also Connect via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-neutral-900 font-bold text-xs uppercase tracking-wider"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="p-6 sm:p-7 space-y-4">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center justify-between">
                  <span className="truncate">📌 {workspaceName}</span>
                  <span className="font-extrabold">{formatCurrency(pricePerMonth)}/mo</span>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-relaxed">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                    YOUR FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                      EMAIL ADDRESS *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                      PHONE NUMBER *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="9876543210 (10 digits)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                      PREFERRED MOVE-IN DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.moveInDate}
                      onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                      REQUIRED SEATS *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.seats}
                      onChange={(e) => setForm({ ...form, seats: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                    SPECIAL REQUIREMENTS / MESSAGE
                  </label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Team arrangement, high-speed LAN, weekend access..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl mt-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                  {submitting ? "Registering Lead..." : "Submit Inquiry Lead"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
