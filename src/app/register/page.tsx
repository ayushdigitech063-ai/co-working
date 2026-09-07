"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Building2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NexusHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mt-6">Create your account</h1>
          <p className="text-neutral-500 text-sm mt-1">Join thousands of professionals at NexusHub</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="name">Full Name</label>
              <input id="name" type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                placeholder="Ayush Sharma" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="phone">Phone (optional)</label>
              <input id="phone" type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                placeholder="+91 98765 43210" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPass ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition pr-11"
                  placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="confirm">Confirm Password</label>
              <input id="confirm" type="password" required value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition"
                placeholder="Re-enter password" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition disabled:opacity-60 flex items-center justify-center mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 font-semibold hover:text-amber-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
