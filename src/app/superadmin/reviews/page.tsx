"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { Star, Search, Loader2, Building2, User, Trash2 } from "lucide-react";

export default function SuperAdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reviews");
      const list = res.data?.data?.content || [];
      setReviews(list);
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      showErrorAlert("Load Error", err?.response?.data?.message || "Failed to load member reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user?.name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.workspace?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 w-full font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">SUPER ADMIN CONTROL PANEL</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">Reviews &amp; Ratings Moderation</h1>
          <p className="text-xs text-slate-500 font-medium">Monitor member feedback, star ratings, and community testimonials.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by member name, comment, workspace..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm p-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading Member Reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Star className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Member Reviews Found</h4>
            <p className="text-xs text-slate-400">Reviews submitted by verified members will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((r) => (
              <div key={r._id} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-950 text-white font-bold text-xs flex items-center justify-center">
                      {(r.user?.name || "M").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{r.user?.name || "Member User"}</h4>
                      <p className="text-[10px] text-slate-400">{r.workspace?.name || "Workspace Hub"}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
