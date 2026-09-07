"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { bookingService } from "@/services/bookingService";
import { CalendarDays, MapPin, Loader2, XCircle, CheckCircle, Clock } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5" />,
  CONFIRMED: <CheckCircle className="w-3.5 h-3.5" />,
  CANCELLED: <XCircle className="w-3.5 h-3.5" />,
  COMPLETED: <CheckCircle className="w-3.5 h-3.5" />,
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    bookingService.getMyBookings().then((data) => {
      setBookings(data.content || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(id);
    try {
      await bookingService.cancel(id);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "CANCELLED" } : b));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      {/* LUXURY HERO BANNER WITH BACKGROUND IMAGE */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-16 lg:py-20 border-b border-neutral-800">
        {/* Prime Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-black/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-3 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-extrabold uppercase tracking-widest shadow-xl">
              <CalendarDays className="w-3.5 h-3.5" /> MEMBER DASHBOARD
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              My Workspace Bookings
            </h1>
            <p className="text-stone-100 text-xs sm:text-sm leading-relaxed font-medium text-center max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Manage, review, and track all your active corporate office reservations across India.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {bookings.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-neutral-100">
            <CalendarDays className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-neutral-700 mb-2">No bookings yet</h2>
            <p className="text-sm text-neutral-400 mb-6">Start by browsing our available workspaces.</p>
            <button onClick={() => router.push("/workspaces")}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition">
              Browse Workspaces
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 flex flex-col sm:flex-row gap-5">
                {/* Image */}
                <div className="w-full sm:w-28 h-24 sm:h-auto rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    src={b.workspace?.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80"}
                    alt={b.workspace?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg">{b.workspace?.name}</h3>
                      {b.workspace?.location && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {b.workspace.location?.name || ""}
                        </p>
                      )}
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[b.status]}`}>
                      {STATUS_ICONS[b.status]} {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">Start Date</p>
                      <p className="font-semibold text-neutral-800">{formatDate(b.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">End Date</p>
                      <p className="font-semibold text-neutral-800">{formatDate(b.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-medium">Total</p>
                      <p className="font-bold text-neutral-900">{formatCurrency(b.totalPrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {b.status === "PENDING" && (
                  <div className="flex items-center sm:items-start">
                    <button
                      onClick={() => handleCancel(b._id)}
                      disabled={cancelling === b._id}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 transition disabled:opacity-50 flex items-center gap-1.5">
                      {cancelling === b._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
