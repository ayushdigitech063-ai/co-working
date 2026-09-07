"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { Building2, TrendingUp, Handshake, CheckCircle2, Send, Loader2, ShieldCheck, Award } from "lucide-react";

export default function InvestorRelationsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    company: "",
    investmentType: "Regional Partner / Franchise Admin",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/queries", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        queryType: "INVESTOR_PARTNER_LEAD",
        message: `Company: ${form.company} | Partner Type: ${form.investmentType} | Note: ${form.message}`,
      });

      showSuccessAlert(
        "Application Submitted! 🚀",
        "Our Partnership & Expansion Team will review your application and contact you within 24 hours."
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        company: "",
        investmentType: "Regional Partner / Franchise Admin",
        message: "",
      });
    } catch (err: any) {
      showErrorAlert("Submission Failed", err?.response?.data?.message || "Failed to submit partnership application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 flex flex-col font-sans">
      <Navbar />

      {/* LUXURY HERO BANNER WITH BACKGROUND IMAGE */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-20 lg:py-24 border-b border-neutral-800">
        {/* Prime Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-widest shadow-xl">
              <Award className="w-3.5 h-3.5" /> PARTNER &amp; INVESTOR RELATIONS
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Partner with India&apos;s Fastest Growing Workspace Network.
            </h1>
            <p className="text-stone-100 text-sm sm:text-base leading-relaxed font-medium text-center max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Become a Regional Workspace Admin, Franchise Partner, or Property Owner with NexusHub. Unlock high-yield rental returns and scale co-working hubs across prime business cities.
            </p>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP HIGHLIGHTS */}
      <section className="py-12 bg-white border-b border-neutral-200/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-stone-50 border border-neutral-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">High Yield ROIs</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Earn steady monthly returns with high-occupancy corporate seats and managed enterprise suites.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-neutral-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Regional Admin Access</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Get full access to your Regional Admin Control Panel to submit workspace inventory &amp; manage member bookings.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 border border-neutral-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Enterprise Turnkey Setup</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                End-to-end support for interior design, Cloudinary multi-view asset management, and corporate member onboarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD APPLICATION FORM SECTION */}
      <section className="py-16 bg-stone-50 flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Info Side */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">BECOME A PARTNER</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-950">
                Submit Your Partnership Application
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Fill out the application form below. Our Super Admin team will review your details and set up your Admin credentials upon approval.
              </p>

              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Regional Admin Dashboard</h4>
                    <p className="text-[11px] text-neutral-500">Dedicated portal for inventory management &amp; lead tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Instant Lead Routing</h4>
                    <p className="text-[11px] text-neutral-500">Applications route directly to Super Admin for fast onboarding.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form Box */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-xl">
              <form onSubmit={handleSubmitLead} className="space-y-5">
                <h3 className="text-xl font-serif font-bold text-neutral-950 pb-2 border-b border-neutral-100">
                  Investor &amp; Regional Admin Application
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ayush Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="partner@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Target City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Gurugram, Bengaluru, Mumbai"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Company / Property Name
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Nexa Commercial Towers"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Partnership Type
                    </label>
                    <select
                      value={form.investmentType}
                      onChange={(e) => setForm({ ...form, investmentType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Regional Partner / Franchise Admin">Regional Partner / Franchise Admin</option>
                      <option value="Property Owner Listing">Property Owner Listing</option>
                      <option value="Enterprise Investor">Enterprise Investor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Proposal Notes / Details
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your space capacity, expected seats, or partnership goals..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm transition shadow-xl flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                  Submit Application to Super Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
