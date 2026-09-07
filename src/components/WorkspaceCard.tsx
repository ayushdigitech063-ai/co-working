import Link from "next/link";
import { Workspace, WorkspaceType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
  const typeName =
    workspace.workspaceType && typeof workspace.workspaceType === "object"
      ? (workspace.workspaceType as WorkspaceType).name || "Private Office"
      : workspace.workspaceType || "Private Office";

  const nameSlug = workspace.name
    ? workspace.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : workspace._id;

  return (
    <Link
      href={`/workspaces/${nameSlug}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-56 w-full overflow-hidden bg-neutral-100 shrink-0">
        <img
          src={workspace.imageUrl || defaultImage}
          alt={workspace.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 items-start max-w-[70%]">
          <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-neutral-800 shadow-sm truncate">
            {typeName}
          </div>
          {((workspace as any).isPopular || (workspace as any).category === "POPULAR") && (
            <span className="bg-amber-500 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              🔥 POPULAR
            </span>
          )}
          {((workspace as any).isPremium || (workspace as any).category === "PREMIUM") && (
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              ⭐ PREMIUM
            </span>
          )}
          {(workspace as any).isVirtualOffice && (
            <span className="bg-blue-600 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              🌐 VIRTUAL OFFICE
            </span>
          )}
        </div>
        {/* Availability badge */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          {workspace.available ? (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> <span className="hidden sm:inline">Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> <span className="hidden sm:inline">Occupied</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors mb-1 sm:mb-2 line-clamp-1">
            {workspace.name}
          </h3>
          <p className="text-neutral-500 text-[11px] sm:text-sm line-clamp-2 mb-2 sm:mb-4 leading-snug sm:leading-relaxed">
            {workspace.description ||
              "Designed for ultimate focus and seamless connectivity."}
          </p>
        </div>

        <div className="pt-2 sm:pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
          <div>
            <span className="text-[9px] sm:text-xs text-neutral-400 block font-medium uppercase tracking-wider">
              Starting at
            </span>
            <span className="text-xs sm:text-lg font-bold text-neutral-900">
              {formatCurrency(workspace.price)}
              <span className="text-[10px] sm:text-xs text-neutral-500 font-normal"> / mo</span>
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-3 mt-1 sm:mt-0">
            <div className="flex items-center text-[10px] sm:text-xs font-medium text-neutral-500 bg-neutral-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-neutral-100">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-neutral-400" />
              {workspace.capacity} Seats
            </div>
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-amber-600 transition-colors shrink-0">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
