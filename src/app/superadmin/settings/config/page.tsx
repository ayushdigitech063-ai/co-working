"use client";

import { useState } from "react";
import { showSuccessAlert } from "@/utils/swal";
import { Sliders, Save, ShieldCheck, Mail, Globe, Server } from "lucide-react";

export default function SuperAdminConfigPage() {
  const [config, setConfig] = useState({
    siteName: "NexusHub India",
    smtpUser: "ayushdigitech063@gmail.com",
    supportPhone: "+91 8385973582",
    gstPercentage: "18",
    autoApproveAdmins: false,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showSuccessAlert("Settings Saved!", "System configuration settings updated successfully.");
    }, 500);
  };

  return (
    <div className="space-y-8 w-full font-sans max-w-4xl">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">SUPER ADMIN CONTROL PANEL</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">System Configuration</h1>
          <p className="text-xs text-slate-500 font-medium">Manage global platform parameters, SMTP defaults, and tax settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-7 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-600" /> Platform Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Support Desk Line
              </label>
              <input
                type="text"
                value={config.supportPhone}
                onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600" /> SMTP &amp; Email Dispatch
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Sender Email Address
            </label>
            <input
              type="email"
              value={config.smtpUser}
              onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-600" /> Tax &amp; Billing
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Standard GST Percentage (%)
            </label>
            <input
              type="number"
              value={config.gstPercentage}
              onChange={(e) => setConfig({ ...config, gstPercentage: e.target.value })}
              className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
