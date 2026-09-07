"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ShieldAlert, Loader2, KeyRound } from "lucide-react";

export default function SuperAdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Demo Autofill Function
  const handleAutofill = () => {
    setForm({
      email: "superadmin@nexushub.com",
      password: "SuperAdmin@2026",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);

      const token = localStorage.getItem("nexushub_token");
      if (token) {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.role !== "SUPER_ADMIN") {
            setError("Access denied. This portal is strictly for Super Administrators.");
            setLoading(false);
            return;
          }
          return router.push("/superadmin");
        }
      }
      router.push("/superadmin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Super Admin authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 font-sans text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Super Admin Portal
          </h1>
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            Restricted Master Control Gateway
          </p>
        </div>

        {/* Quick Demo Credentials Autofill Banner */}
        <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Super Admin Demo Credentials</div>
              <div className="text-[11px] text-neutral-400 font-mono">superadmin@nexushub.com</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutofill}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition shadow-sm"
          >
            Auto Fill
          </button>
        </div>

        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5" htmlFor="sa-email">
                Super Admin Email
              </label>
              <input
                id="sa-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="superadmin@nexushub.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5" htmlFor="sa-pass">
                Master Password
              </label>
              <div className="relative">
                <input
                  id="sa-pass"
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 pr-11"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Authenticating Master Key..." : "Authorize Super Admin Login"}
            </button>
          </form>

          <div className="border-t border-neutral-800 pt-4 text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
