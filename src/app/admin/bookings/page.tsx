"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { CalendarCheck, Search, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    api.get("/bookings")
      .then((res) => setBookings(res.data.data.content))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      showSuccessAlert("Booking Updated", `Booking status set to ${status}.`);
      fetchBookings();
    } catch (err: any) {
      showErrorAlert("Update Failed", err?.response?.data?.message || "Failed to update booking status.");
    }
  };

  return (
    <div className="space-y-8 w-full font-sans">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">CUSTOMER BOOKINGS</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Regional Member Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage desk reservations &amp; update confirmation status.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Booking Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading Bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No active member bookings recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-950">
                      {b.user?.name || b.name || "Customer Member"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.workspace?.name || "Private Cabin"}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">₹{(b.totalPrice || 12500).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status || "CONFIRMED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleStatusUpdate(b._id, "CANCELLED")}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition text-[11px]"
                      >
                        Cancel Booking
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
