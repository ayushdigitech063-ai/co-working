"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { FileText, Loader2, User, Shield } from "lucide-react";

interface AuditLogItem {
  _id: string;
  user: { name: string; email: string; role: string };
  action: string;
  entityType: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export default function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admins/audit-logs")
      .then((res) => setLogs(res.data.data.content))
      .catch((err) => console.error("Failed to load audit logs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">SECURITY AUDIT PERSISTENCE</span>
        <h1 className="text-3xl font-serif font-bold text-neutral-950 mt-1">System Audit Logs</h1>
        <p className="text-xs text-neutral-500 mt-1">Real-time immutable log of admin actions, account status updates, &amp; content approvals.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-600">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{log.user?.name || "System"}</div>
                      <div className="text-[11px] text-neutral-400">{log.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-700 max-w-xs leading-relaxed">{log.description}</td>
                    <td className="px-6 py-4 text-neutral-400 font-mono text-[11px]">{log.ipAddress || "127.0.0.1"}</td>
                    <td className="px-6 py-4 text-right text-neutral-400">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
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
