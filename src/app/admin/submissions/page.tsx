"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/approvals")
      .then((res) => setSubmissions(res.data.data.content))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 w-full font-sans">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">APPROVAL QUEUE STATUS</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">My Submissions</h1>
        <p className="text-xs text-slate-500 mt-1">Track approval status of your created and edited content submitted to Super Admin.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rejection Feedback (If Any)</th>
                <th className="px-6 py-4 text-right">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No content submissions recorded yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{sub.entityType}</td>
                    <td className="px-6 py-4 font-bold text-amber-600 uppercase">{sub.action}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : sub.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 italic">
                      {sub.rejectionReason || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
