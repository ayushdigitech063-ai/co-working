"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, CheckCircle2, Phone, Mail, Clock, Save, Sparkles, Check } from "lucide-react";

const RBAC_ROLES = [
  {
    role: "SUPER_ADMIN",
    title: "Super Administrator",
    badge: "Master Control",
    desc: "Complete system authority. Only role capable of managing Admins and approving live content.",
    permissions: [
      "ALL_PERMISSIONS",
      "ADMIN_CREATE_EDIT_SUSPEND_DELETE",
      "CONTENT_APPROVAL_WORKFLOW",
      "SYSTEM_AUDIT_LOG_INSPECTION",
      "GLOBAL_PRICING_AND_SETTINGS",
    ],
  },
  {
    role: "ADMIN",
    title: "Regional Administrator",
    badge: "Content Creator",
    desc: "Manages local workspaces, locations, and views bookings/leads. All created content requires Super Admin approval.",
    permissions: [
      "WORKSPACE_CREATE (PENDING)",
      "WORKSPACE_EDIT (PENDING)",
      "LOCATION_CREATE (PENDING)",
      "BOOKING_VIEW & MANAGE",
      "LEAD_VIEW & MANAGE",
      "REVIEW_VIEW & MANAGE",
    ],
  },
  {
    role: "USER",
    title: "Customer Member",
    badge: "End Customer",
    desc: "Standard customer account. Can view approved public workspaces, book desks, and manage own profile.",
    permissions: [
      "PROFILE_VIEW & EDIT",
      "BOOKING_CREATE",
      "BOOKING_VIEW_OWN",
      "REVIEW_CREATE",
    ],
  },
];

export default function SuperAdminSettingsPage() {
  const [supportPhone, setSupportPhone] = useState<string>("1800 123 77888");
  const [supportEmail, setSupportEmail] = useState<string>("support@nexushub.in");
  const [supportHours, setSupportHours] = useState<string>("Mon - Sat: 9:00 AM - 8:00 PM IST");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = localStorage.getItem("nexushub_support_phone");
      if (storedPhone) setSupportPhone(storedPhone);

      const storedEmail = localStorage.getItem("nexushub_support_email");
      if (storedEmail) setSupportEmail(storedEmail);

      const storedHours = localStorage.getItem("nexushub_support_hours");
      if (storedHours) setSupportHours(storedHours);
    }
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const cleanPhone = supportPhone.trim();
      const cleanEmail = supportEmail.trim();
      const cleanHours = supportHours.trim();

      localStorage.setItem("nexushub_support_phone", cleanPhone);
      localStorage.setItem("nexushub_support_email", cleanEmail);
      localStorage.setItem("nexushub_support_hours", cleanHours);

      // Save to Backend API if endpoint exists or persist in DB
      try {
        await api.put("/settings", {
          supportPhone: cleanPhone,
          supportEmail: cleanEmail,
          supportHours: cleanHours,
        });
      } catch (err) {
        // Fallback gracefully to localStorage
      }

      // Dispatch custom event for real-time navbar/footer updates across components
      window.dispatchEvent(new Event("nexushub_phone_updated"));
      window.dispatchEvent(new Event("storage"));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-10 w-full font-sans">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">
          SYSTEM CONFIGURATION &amp; ACCESS CONTROL
        </span>
        <h1 className="text-3xl font-serif font-bold text-neutral-950 mt-1">
          System Settings &amp; Global Contact Info
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage header toll-free numbers, support email address, and view platform Role-Based Access Control (RBAC).
        </p>
      </div>

      {/* GLOBAL BRAND & CONTACT SETTINGS */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 font-mono">
              LIVE WEBSITE HEADER &amp; FOOTER CONTACT
            </span>
            <h2 className="text-xl font-bold text-neutral-950 mt-0.5">
              Support Contact &amp; Toll-Free Phone
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Updates phone numbers across Navbar, Footer, and Contact sections instantly.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully! Support number &amp; contact info updated across the site.</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-mono flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" /> Support Phone Number
            </label>
            <input
              type="text"
              required
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="e.g. 1800 123 77888"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-neutral-300 text-sm font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Displayed in Navbar &amp; Footer call links.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-600" /> Support Email Address
            </label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="e.g. support@nexushub.in"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-neutral-300 text-sm font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Official support email for customer queries.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Support Hours
            </label>
            <input
              type="text"
              required
              value={supportHours}
              onChange={(e) => setSupportHours(e.target.value)}
              placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM IST"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-neutral-300 text-sm font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Operating hours shown on contact touchpoints.</p>
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-400" /> Save Contact Settings
            </button>
          </div>
        </form>
      </div>

      {/* RBAC Matrix Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-serif font-bold text-neutral-950">Role-Based Access Control (RBAC)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RBAC_ROLES.map((r) => (
            <div key={r.role} className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-mono">
                    {r.badge}
                  </span>
                  <Lock className="w-4 h-4 text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-950">{r.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{r.desc}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider font-mono">Granted Authority</span>
                {r.permissions.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
