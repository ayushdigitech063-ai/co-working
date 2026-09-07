"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { MessageSquare, Loader2, Mail, Phone } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads")
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) {
          setLeads(data);
        } else if (data && Array.isArray(data.content)) {
          setLeads(data.content);
        } else {
          setLeads([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 w-full font-sans">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">MEMBER ENQUIRIES</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Leads &amp; Tour Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Contact customer leads requesting workspace tours and custom pricing.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Interested Workspace</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching Leads...
                  </td>
                </tr>
              ) : !Array.isArray(leads) || leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No tour requests or leads recorded yet.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-950">{l.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{l.email}</div>
                      <div className="text-[11px] text-slate-400">{l.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{l.workspaceType || "Private Cabin"}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {l.status || "NEW"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {new Date(l.createdAt).toLocaleDateString("en-IN", {
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
