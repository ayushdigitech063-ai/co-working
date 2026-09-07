"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles, Send, Loader2, CheckCircle2, ShieldCheck, Phone, Mail, User, MapPin, ArrowRight, MessageCircle } from "lucide-react";
import { api } from "@/services/api";

export default function AutoLeadPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1/2 Steps
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Panipat",
    workspaceType: "Dedicated Desk",
    agreeTerms: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Strictly disable popup on Admin and Super Admin dashboard portals
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin") || pathname?.startsWith("/super-admin");

  const whatsappNumber = "8385973582";
  const whatsappMessage = encodeURIComponent(
    `Hello NexusHub India! 👋\nI just claimed the 20% OFF Offer for:\n📌 Name: *${form.firstName} ${form.lastName}*\n📍 City: *${form.city}*\n🏢 Type: *${form.workspaceType}*\n\nPlease confirm availability & day pass details!`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    if (isAdminRoute) return;

    // Don't show if already submitted or dismissed in this session
    const dismissed = sessionStorage.getItem("nexushub_auto_popup_dismissed");
    if (dismissed === "true") return;

    let timer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!timer && !isOpen) {
        // Start 10-second timer after user starts scrolling
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 10000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  // Lock background scroll when popup opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("nexushub_auto_popup_dismissed", "true");
  };

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    if (!form.agreeTerms) {
      setError("Please acknowledge and agree to terms & privacy policy.");
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanedPhone = form.phone.replace(/\D/g, "");
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    try {
      await api.post("/queries", {
        name: fullName,
        email: form.email,
        phone: cleanedPhone,
        message: `Claimed 20% OFF Offer & Free Day Pass (City: ${form.city}, Workspace Type: ${form.workspaceType})`,
      });

      setSuccess(true);
      sessionStorage.setItem("nexushub_auto_popup_dismissed", "true");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit inquiry lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-4xl bg-white text-neutral-900 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-neutral-100">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-neutral-600 hover:text-neutral-900 transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: VIBRANT AMBER/ORANGE IMAGE CONTAINER WITH CURVED CUTOUT */}
        <div className="md:w-1/2 bg-amber-500 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden shrink-0">
          <div className="relative w-full h-full min-h-[260px] md:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/40">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="NexusHub Team Workspace"
              className="w-full h-full object-cover"
            />
            {/* OVERLAY BADGE */}
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 backdrop-blur-md text-white rounded-2xl border border-white/20 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-extrabold tracking-widest font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXUSHUB EXCLUSIVE</span>
              </div>
              <h4 className="font-serif font-bold text-sm">20% OFF First Month + Free Day Pass</h4>
              <p className="text-[11px] text-neutral-300">Empowering your startup &amp; team growth.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN FORM */}
        <div className="md:w-1/2 p-6 sm:p-9 flex flex-col justify-center">
          {success ? (
            <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 font-mono">OFFER REGISTERED</span>
                <h3 className="text-2xl font-serif font-bold text-neutral-950">Registration Complete! 🎉</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                  Thank you <strong>{form.firstName} {form.lastName}</strong>! Your 20% discount &amp; free day pass for <strong>{form.city}</strong> has been logged. Our specialist will contact you on <strong>+91 {form.phone}</strong> shortly.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Connect Instantly via WhatsApp</span>
                </a>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-neutral-900 font-bold text-xs uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* HEADER WITH 1/2 STEPS BADGE */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-950">Claim Offer</h3>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold font-mono">
                    {step}/2 Steps
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Take the next step for greater opportunities &amp; instant workspace access.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-relaxed">
                  ⚠️ {error}
                </div>
              )}

              {step === 1 ? (
                /* STEP 1: PERSONAL & CONTACT INFO */
                <form onSubmit={handleSubmitStep1} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                        FIRST NAME *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          placeholder="First name"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                        LAST NAME *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          placeholder="Last name"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                        EMAIL *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Email address"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
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
                          placeholder="Phone No"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TERMS CHECKBOX */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="popup-terms"
                      checked={form.agreeTerms}
                      onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                      className="mt-0.5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="popup-terms" className="text-[10px] text-neutral-500 leading-tight font-medium cursor-pointer">
                      By submitting, you acknowledge and agree to our Terms and conditions and privacy policy.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Proceed to Step 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* STEP 2: LOCATION & WORKSPACE PREFERENCE */
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                        PREFERRED CITY *
                      </label>
                      <select
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="Panipat">Panipat</option>
                        <option value="Hubballi">Hubballi</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Gurugram">Gurugram</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                        WORKSPACE TYPE *
                      </label>
                      <select
                        value={form.workspaceType}
                        onChange={(e) => setForm({ ...form, workspaceType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="Hot Desk">Hot Desk</option>
                        <option value="Dedicated Desk">Dedicated Desk</option>
                        <option value="Private Cabin">Private Office / Cabin</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Virtual Office">Virtual Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold space-y-1">
                    <span className="font-extrabold font-mono block">✨ CLAIM 20% DISCOUNT + FREE DAY PASS</span>
                    <p className="text-[11px] text-amber-800 leading-normal">
                      Connecting for {form.firstName} {form.lastName} (+91 {form.phone})
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-neutral-800 font-bold text-xs"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4" />}
                      {loading ? "Claiming Offer..." : "Claim 20% OFF Offer"}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-[10px] text-center text-neutral-400 font-medium flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Call Back &bull; Super Admin &amp; Space Manager Alerted</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
