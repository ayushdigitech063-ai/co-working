import Link from "next/link";
import { Location } from "@/types";
import { MapPin, Navigation, ArrowRight } from "lucide-react";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80";

  const stateName = location.state || "Rajasthan";
  const cityName = location.city || location.name || "Jaipur";
  const toSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const exploreUrl = `/locations/${toSlug(stateName)}/${toSlug(cityName)}/${toSlug(areaName)}`;

  return (
    <Link
      href={exploreUrl}
      className="group bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col font-sans"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <img
          src={location.imageUrl || defaultImage}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
          {cityName}
        </div>
        <div className="absolute bottom-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider font-mono shadow-md">
          {stateName}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block mb-1">
            {areaName} HUB
          </span>
          <h3 className="text-xl font-serif font-bold text-neutral-950 group-hover:text-amber-600 transition-colors mb-2">
            {location.name}
          </h3>
          <p className="text-xs text-neutral-500 mb-3 flex items-start font-medium">
            <Navigation className="w-3.5 h-3.5 mr-1.5 text-neutral-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{location.address}</span>
          </p>
          <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed">
            {location.description ||
              "State-of-the-art office infrastructure with high-speed fiber internet and 24/7 corporate access."}
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-extrabold text-neutral-900 group-hover:text-amber-600 uppercase tracking-wider transition-colors">
            View Workspaces in {areaName}
          </span>
          <span className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center group-hover:bg-amber-600 transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </span>
        </div>
      </div>
    </Link>
  );
}
