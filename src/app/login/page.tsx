"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Building2, Loader2, ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";

export default function UnifiedLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          const loggedUser = data.data;

          if (loggedUser.role === "SUPER_ADMIN") {
            return router.push("/superadmin");
          } else if (loggedUser.role === "ADMIN") {
            return router.push("/admin");
          } else {
            return router.push("/my-bookings");
          }
        }
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please verify email address, password, or account status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-950 text-white font-sans relative overflow-hidden">
      {/* LUXURY HIGH-RESOLUTION PRIME BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-black/30" />

      {/* HEADER */}
      <header className="relative z-10 py-6 px-6 sm:px-10 border-b border-white/10 backdrop-blur-sm bg-neutral-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-serif font-black tracking-tighter text-white leading-none">
              nexushub
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-amber-400 mt-0.5 font-mono">
              INDIA
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </Link>
        </div>
      </header>

      {/* MAIN CENTERED LOGIN CONTAINER */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          {/* LOGO ICON & TYPOGRAPHY */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-2xl">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Sign In to NexusHub
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Unified Access Portal for Members &amp; Workspace Administrators
            </p>
          </div>

          {/* HIGH-CONTRAST GLASS CARD */}
          <div className="bg-white/95 backdrop-blur-xl text-neutral-900 rounded-3xl border border-neutral-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-7 sm:p-9 space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold leading-relaxed animate-in fade-in duration-150">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono" htmlFor="login-email">
                  EMAIL ADDRESS *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    placeholder="ayushdigitech063@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5 font-mono" htmlFor="login-pass">
                  PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    id="login-pass"
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-neutral-200 bg-stone-50 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-xl"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-amber-400" />}
                {loading ? "Verifying Credentials..." : "Sign In to Portal"}
              </button>
            </form>

            {/* AUTHORIZED PERSONNEL ONLY NOTICE */}
            <div className="pt-4 border-t border-neutral-100 text-center">
              <p className="text-[11px] font-semibold text-neutral-500 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-neutral-100 flex items-center justify-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Authorized Access Only: Account credentials are created &amp; issued by Super Admin.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 py-5 text-center text-xs font-medium text-stone-400 border-t border-white/10 backdrop-blur-sm bg-neutral-950/40">
        &copy; {new Date().getFullYear()} NexusHub Co-Working India. All rights reserved.
      </footer>
    </div>
  );
}
