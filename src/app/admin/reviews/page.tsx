"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Star, Loader2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reviews")
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (data && Array.isArray(data.content)) {
          setReviews(data.content);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 w-full font-sans">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">MEMBER FEEDBACK</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Customer Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">Inspect member ratings &amp; workspace feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading Reviews...
          </div>
        ) : !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{r.user?.name || "Member"}</span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-500" /> {r.rating}/5
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">&quot;{r.comment}&quot;</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
