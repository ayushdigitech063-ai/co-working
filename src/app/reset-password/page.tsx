"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { KeyRound, ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showErrorAlert("Invalid Token", "Password reset token is missing from the URL link.");
      return;
    }

    if (newPassword.length < 6) {
      showErrorAlert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorAlert("Password Mismatch", "New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: newPassword,
      });

      // Clear any auto-stored session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      showSuccessAlert(
        "Password Updated Successfully! 🎉",
        "Your permanent admin password has been set. Please login with your email and new password."
      );

      // Redirect to /login page (Unified Login)
      router.push("/login");
    } catch (err: any) {
      showErrorAlert(
        "Password Reset Failed",
        err?.response?.data?.message || "Invalid or expired password setup link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <KeyRound className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
            Set Permanent Admin Password
          </h1>
          <p className="text-xs text-slate-400">
            Please configure your permanent password to activate your Regional Admin account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new permanent password"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new permanent password"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 stroke-[2.5]" />}
            {loading ? "Updating Password..." : "Save Password & Proceed to Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
