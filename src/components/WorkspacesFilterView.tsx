"use client";

import { useState, useRef, useEffect } from "react";
import WorkspaceCard from "@/components/WorkspaceCard";
import { workspaceService } from "@/services/workspaceService";
import { WorkspaceType } from "@/types";
import { MapPin, X, Loader2, ChevronDown, Check, Search } from "lucide-react";

interface WorkspacesFilterViewProps {
  initialWorkspaces: any[];
  initialTotalElements: number;
  initialTotalPages: number;
  types: WorkspaceType[];
  allLocations: any[];
  initialState?: string;
  initialCity?: string;
  initialArea?: string;
  initialTypeId?: string;
  initialSearch?: string;
  baseUrl?: string;
}

export default function WorkspacesFilterView({
  initialWorkspaces,
  initialTotalElements,
  initialTotalPages,
  types,
  allLocations,
  initialState = "",
  initialCity = "",
  initialArea = "",
  initialTypeId = "",
  initialSearch = "",
  baseUrl = "/workspaces",
}: WorkspacesFilterViewProps) {
  const [workspaces, setWorkspaces] = useState<any[]>(initialWorkspaces);
  const [totalElements, setTotalElements] = useState<number>(initialTotalElements);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Active filter states
  const [activeState, setActiveState] = useState<string>(initialState);
  const [activeCity, setActiveCity] = useState<string>(initialCity);
  const [activeArea, setActiveArea] = useState<string>(initialArea);
  const [activeTypeId, setActiveTypeId] = useState<string>(initialTypeId);
  const [activeSearch, setActiveSearch] = useState<string>(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeAvailability, setActiveAvailability] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("recommended");

  // Active open popover: "area" | "type" | "price" | "availability" | null
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine target city for area options
  let targetCity = activeCity;
  if (!targetCity && activeArea) {
    const matchedLoc = allLocations.find(
      (l) => (l.area || l.name || "").toLowerCase() === activeArea.toLowerCase()
    );
    if (matchedLoc?.city) targetCity = matchedLoc.city;
  }
  if (!targetCity && activeState?.toLowerCase() === "rajasthan") {
    targetCity = "Jaipur";
  }
  if (!targetCity && allLocations.length > 0) {
    const jaipurLoc = allLocations.find((l) => (l.city || "").toLowerCase() === "jaipur");
    if (jaipurLoc) targetCity = "Jaipur";
    else targetCity = allLocations[0].city || "Jaipur";
  }

  // Seamlessly update the page's original Hero Banner text in real-time
  useEffect(() => {
    const titleEl = document.getElementById("hero-title");
    const subEl = document.getElementById("hero-subtitle");
    if (titleEl) {
      titleEl.innerText = activeArea
        ? `${activeArea} Co-Working Workspaces`
        : targetCity
        ? `${targetCity} Co-Working Workspaces`
        : activeState
        ? `${activeState} Co-Working Hubs`
        : "Browse Prime Co-Working Workspaces";
    }
    if (subEl) {
      const loc = activeArea || targetCity || activeState || "India";
      subEl.innerText = `Explore high-speed workstations, executive private cabins, meeting conference suites, and virtual business addresses in ${loc}.`;
    }
  }, [activeArea, targetCity, activeState]);

  // Get all unique areas for targetCity
  const cityAreas = targetCity
    ? Array.from(
        new Set(
          allLocations
            .filter((l) => (l.city || "").toLowerCase() === targetCity.toLowerCase())
            .map((l) => l.area || l.name)
            .filter(Boolean)
        )
      )
    : [];

  const hasActiveFilters = Boolean(
    activeTypeId || activeArea || activeSearch || activeAvailability !== "all"
  );

  // Fetch workspaces dynamically without full page reload
  const handleFilterChange = async (newFilters: {
    state?: string;
    city?: string;
    area?: string;
    typeId?: string;
    search?: string;
    category?: string;
    availability?: string;
    sort?: string;
    page?: number;
  }) => {
    setOpenMenu(null);

    const nextState = newFilters.state !== undefined ? newFilters.state : activeState;
    const nextCity = newFilters.city !== undefined ? newFilters.city : activeCity;
    const nextArea = newFilters.area !== undefined ? newFilters.area : activeArea;
    const nextTypeId = newFilters.typeId !== undefined ? newFilters.typeId : activeTypeId;
    const nextSearch = newFilters.search !== undefined ? newFilters.search : activeSearch;
    const nextCategory = newFilters.category !== undefined ? newFilters.category : activeCategory;
    const nextAvailability = newFilters.availability !== undefined ? newFilters.availability : activeAvailability;
    const nextSort = newFilters.sort !== undefined ? newFilters.sort : activeSort;
    const nextPage = newFilters.page || 1;

    setActiveState(nextState);
    setActiveCity(nextCity);
    setActiveArea(nextArea);
    setActiveTypeId(nextTypeId);
    setActiveSearch(nextSearch);
    setActiveCategory(nextCategory);
    setActiveAvailability(nextAvailability);
    setActiveSort(nextSort);
    setPage(nextPage);

    setLoading(true);

    // Update browser URL silently without hard reload
    const params = new URLSearchParams();
    if (nextState) params.set("state", nextState);
    if (nextCity) params.set("city", nextCity);
    if (nextArea) params.set("area", nextArea);
    if (nextTypeId) params.set("typeId", nextTypeId);
    if (nextSearch) params.set("search", nextSearch);
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    if (nextPage > 1) params.set("page", String(nextPage));

    const queryStr = params.toString();
    const newUrl = queryStr ? `${baseUrl}?${queryStr}` : baseUrl;
    window.history.pushState(null, "", newUrl);

    try {
      const data = await workspaceService.getWorkspaces({
        page: nextPage,
        size: 24,
        ...(nextTypeId && { typeId: nextTypeId }),
        ...(nextSearch && { search: nextSearch }),
        ...(nextState && { state: nextState }),
        ...(nextCity && { city: nextCity }),
        ...(nextArea && { area: nextArea }),
        ...(nextAvailability === "available" && { available: true }),
      });

      let content = data.content || [];
      if (nextCategory === "popular") {
        content = content.filter((w: any) => w.isPopular || w.category === "popular");
      } else if (nextCategory === "premium") {
        content = content.filter((w: any) => w.isPremium || w.category === "premium");
      } else if (nextCategory === "normal") {
        content = content.filter((w: any) => !w.isPopular && !w.isPremium && (!w.category || w.category === "normal"));
      }

      if (nextAvailability === "available") {
        content = content.filter((w: any) => w.available);
      }

      if (nextSort === "price-asc") {
        content = [...content].sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (nextSort === "price-desc") {
        content = [...content].sort((a, b) => (b.price || 0) - (a.price || 0));
      }

      setWorkspaces(content);
      setTotalElements(data.totalElements || content.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to filter workspaces", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    handleFilterChange({
      area: "",
      typeId: "",
      search: "",
      category: "all",
      availability: "all",
      sort: "recommended",
      page: 1,
    });
  };

  // Client-side sorted/filtered view
  let displayedWorkspaces = [...workspaces];
  if (activeCategory === "popular") {
    displayedWorkspaces = displayedWorkspaces.filter((w) => w.isPopular || w.category === "popular");
  } else if (activeCategory === "premium") {
    displayedWorkspaces = displayedWorkspaces.filter((w) => w.isPremium || w.category === "premium");
  } else if (activeCategory === "normal") {
    displayedWorkspaces = displayedWorkspaces.filter((w) => !w.isPopular && !w.isPremium && (!w.category || w.category === "normal"));
  }

  if (activeAvailability === "available") {
    displayedWorkspaces = displayedWorkspaces.filter((w) => w.available);
  }
  if (activeSort === "price-asc") {
    displayedWorkspaces.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (activeSort === "price-desc") {
    displayedWorkspaces.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const selectedTypeName = types.find((t) => t._id === activeTypeId)?.name || "";

  return (
    <div className="max-w-6xl mx-auto space-y-5 px-3 sm:px-4" ref={filterRef}>
      {/* 1. COMPACT MAIN FILTER TOOLBAR (Desktop Only >= md) */}
      <div className="hidden md:flex relative z-30 bg-white rounded-2xl border border-neutral-200 shadow-md p-2.5 sm:p-3 flex-wrap items-center justify-between gap-3 transition-all">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* SEARCH INPUT FIELD */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <input
              type="text"
              placeholder="Search by title or keyword..."
              value={activeSearch}
              onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
              className="w-full pl-8 pr-3 py-2 bg-stone-50 hover:bg-stone-100/80 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
            {activeSearch && (
              <button
                type="button"
                onClick={() => handleFilterChange({ search: "", page: 1 })}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Area Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "area" ? null : "area")}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                activeArea
                  ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-neutral-400 font-normal">Area:</span>
              <span className="font-bold">{activeArea || "All Areas"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${openMenu === "area" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "area" && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider">
                  AREAS IN {targetCity ? targetCity.toUpperCase() : "CITY"}
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ area: "" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    !activeArea ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>All Areas</span>
                  {!activeArea && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                {cityAreas.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => handleFilterChange({ area: a })}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                      activeArea.toLowerCase() === a.toLowerCase() ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                    }`}
                  >
                    <span>{a}</span>
                    {activeArea.toLowerCase() === a.toLowerCase() && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Workspace Type & Category Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "type" ? null : "type")}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                activeTypeId || activeSearch.includes("popular") || activeSearch.includes("premium")
                  ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <span className="text-neutral-400 font-normal">Workspace:</span>
              <span className="font-bold">{selectedTypeName || "All Types"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${openMenu === "type" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "type" && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider">
                  WORKSPACE TYPES
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ typeId: "", search: "" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    !activeTypeId && !activeSearch ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>All Workspaces</span>
                  {!activeTypeId && !activeSearch && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                {types.map((t) => (
                  <button
                    type="button"
                    key={t._id}
                    onClick={() => handleFilterChange({ typeId: t._id, search: "" })}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                      activeTypeId === t._id ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                    }`}
                  >
                    <span>{t.name}</span>
                    {activeTypeId === t._id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Sort Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "price" ? null : "price")}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                activeSort !== "recommended"
                  ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <span className="text-neutral-400 font-normal">Price:</span>
              <span className="font-bold">
                {activeSort === "price-asc" ? "Low to High" : activeSort === "price-desc" ? "High to Low" : "Recommended"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${openMenu === "price" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "price" && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider">
                  SORT PRICE
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ sort: "recommended" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeSort === "recommended" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>Recommended</span>
                  {activeSort === "recommended" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ sort: "price-asc" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeSort === "price-asc" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>Low to High</span>
                  {activeSort === "price-asc" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ sort: "price-desc" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeSort === "price-desc" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>High to Low</span>
                  {activeSort === "price-desc" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Category Tier Popover Dropdown (Popular / Premium / Normal) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "category" ? null : "category")}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                activeCategory !== "all"
                  ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <span className="text-neutral-400 font-normal font-mono">Category:</span>
              <span className="font-bold">
                {activeCategory === "popular" ? "🔥 Popular" : activeCategory === "premium" ? "✨ Premium" : activeCategory === "normal" ? "Standard" : "All Categories"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${openMenu === "category" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "category" && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider">
                  CATEGORY TIER
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ category: "all" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeCategory === "all" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>All Categories</span>
                  {activeCategory === "all" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ category: "popular" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeCategory === "popular" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>🔥 Popular</span>
                  {activeCategory === "popular" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ category: "premium" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeCategory === "premium" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>✨ Premium</span>
                  {activeCategory === "premium" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ category: "normal" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition ${
                    activeCategory === "normal" ? "text-amber-600 bg-amber-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>Standard</span>
                  {activeCategory === "normal" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Availability Popover Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "availability" ? null : "availability")}
              className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                activeAvailability === "available"
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm"
                  : "bg-stone-50 hover:bg-stone-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <span className="text-neutral-400 font-normal">Availability:</span>
              <span className="font-bold">{activeAvailability === "available" ? "Available Only" : "All Spaces"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${openMenu === "availability" ? "rotate-180" : ""}`} />
            </button>

            {openMenu === "availability" && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider">
                  AVAILABILITY STATUS
                </div>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ availability: "all" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition ${
                    activeAvailability === "all" ? "text-emerald-600 bg-emerald-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>All Spaces</span>
                  {activeAvailability === "all" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ availability: "available" })}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition ${
                    activeAvailability === "available" ? "text-emerald-600 bg-emerald-50/60 font-bold" : "text-neutral-700"
                  }`}
                >
                  <span>Available Only</span>
                  {activeAvailability === "available" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* 2. DEDICATED AREA PILLS ROW (Clean White Box layout) */}
      {cityAreas.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-3 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 font-mono flex items-center gap-1.5 shrink-0 pr-1">
            <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
            EXPLORE BY AREA:
          </span>
          <button
            type="button"
            onClick={() => handleFilterChange({ area: "" })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              !activeArea
                ? "bg-brand-yellow text-neutral-950 shadow-sm font-extrabold"
                : "bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            All Areas
          </button>
          {cityAreas.map((a: string) => {
            const isActive = activeArea.toLowerCase() === a.toLowerCase();
            return (
              <button
                type="button"
                key={a}
                onClick={() => handleFilterChange({ area: isActive ? "" : a, city: targetCity || activeCity })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-brand-yellow text-neutral-950 shadow-sm font-extrabold border border-amber-400"
                    : "bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. RESULTS HEADER & SORTING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-neutral-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-neutral-950 tracking-tight flex items-center gap-2">
            <span>
              {displayedWorkspaces.length} {displayedWorkspaces.length === 1 ? "Workspace" : "Workspaces"} Found
            </span>
            {loading && <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Executive Workspaces in {activeArea || targetCity || "India"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
          <span>Showing verified listings</span>
        </div>
      </div>

      {/* 4. WORKSPACE CARDS GRID */}
      <div>
        {loading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">
              Loading available workspaces...
            </p>
          </div>
        ) : displayedWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedWorkspaces.map((ws: any) => (
              <div key={ws._id} className="w-full">
                <WorkspaceCard workspace={ws} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto font-bold text-2xl">
              📍
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900">No workspaces match this filter</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              We currently don&apos;t have active workspace listings for this exact area or workspace type. Try clearing filters to view all available spaces.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition shadow-md cursor-pointer"
            >
              View All Workspaces
            </button>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => handleFilterChange({ page: p })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                p === page
                  ? "bg-amber-600 text-white shadow-md font-extrabold"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* MOBILE FLOATING FILTER TRIGGER BUTTON (Positioned Bottom-Left) */}
      <div className="md:hidden fixed bottom-6 left-5 z-40">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="bg-neutral-950 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-neutral-800 hover:scale-105 active:scale-95 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
          )}
        </button>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET DRAWER */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-neutral-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-yellow" />
                <h3 className="text-base font-serif font-bold text-neutral-900">Filter Workspaces</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Controls List */}
            <div className="space-y-4">
              {/* 1. Keyword Search */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 font-mono">
                  SEARCH KEYWORD
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or keyword..."
                    value={activeSearch}
                    onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* 2. Area Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 font-mono">
                  SELECT AREA / LOCALITY
                </label>
                <select
                  value={activeArea}
                  onChange={(e) => handleFilterChange({ area: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
                >
                  <option value="">All Areas</option>
                  {cityAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* 3. Workspace Type */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 font-mono">
                  WORKSPACE TYPE
                </label>
                <select
                  value={activeTypeId}
                  onChange={(e) => handleFilterChange({ typeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
                >
                  <option value="">All Workspaces</option>
                  {types.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* 4. Category Tier */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 font-mono">
                  CATEGORY TIER
                </label>
                <select
                  value={activeCategory}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
                >
                  <option value="all">All Categories</option>
                  <option value="popular">🔥 Popular</option>
                  <option value="premium">✨ Premium</option>
                  <option value="normal">Standard</option>
                </select>
              </div>

              {/* 5. Price Sort */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 font-mono">
                  PRICE SORT
                </label>
                <select
                  value={activeSort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-200">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold text-xs"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-neutral-950 text-white font-bold text-xs shadow-md"
              >
                Apply Filters ({displayedWorkspaces.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
