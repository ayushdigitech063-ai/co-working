"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { getIndianStates, getCitiesOfState } from "@/constants/indianStates";
import {
  X, UploadCloud, Loader2, Plus, Sparkles, Building2, MapPin, Phone,
  MessageCircle, DollarSign, Users, Maximize2, ShieldCheck, Check, Trash2
} from "lucide-react";

const DEFAULT_PRESET_AMENITIES = [
  "High-Speed Fiber Wi-Fi",
  "Air Conditioning",
  "Unlimited Gourmet Coffee & Tea",
  "Printing & Scanning",
  "Ergonomic Office Chairs",
  "100% Power Backup",
  "24/7 Biometric Access",
  "Soundproof Phone Booth",
  "Projector / Full Screen TV",
  "Executive Conference Room",
  "Biometric Security & CCTV",
  "Dedicated Parking Space",
  "Daily Professional Housekeeping",
];

interface WorkspaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locations: any[];
  types: any[];
  isSuperAdmin?: boolean;
  initialData?: any;
}

export default function WorkspaceFormModal({
  isOpen,
  onClose,
  onSuccess,
  locations = [],
  types = [],
  isSuperAdmin = false,
  initialData = null,
}: WorkspaceFormModalProps) {
  // Cascading Location State
  const [selectedState, setSelectedState] = useState<string>("Haryana");
  const [selectedCity, setSelectedCity] = useState<string>("Gurugram");

  // Form Field States
  const [form, setForm] = useState({
    name: "",
    workspaceType: "",
    location: "",
    price: "",
    pricingPeriod: "month",
    capacity: "1",
    sqft: "",
    callNumber: "1800 123 77888",
    whatsappNumber: "8385973582",
    description: "",
    imageUrl: "",
    available: true,
    category: "STANDARD",
    isPopular: false,
    isPremium: false,
    isVirtualOffice: false,
  });

  // Selected Amenities List State
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed Fiber Wi-Fi",
    "Air Conditioning",
    "Unlimited Gourmet Coffee & Tea",
    "Printing & Scanning",
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState<string>("");

  // Gallery Images State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize Form Data when Modal Opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        workspaceType: typeof initialData.workspaceType === "object" ? initialData.workspaceType?._id : initialData.workspaceType || "",
        location: typeof initialData.location === "object" ? initialData.location?._id : initialData.location || "",
        price: initialData.price ? String(initialData.price) : "",
        pricingPeriod: initialData.pricingPeriod || "month",
        capacity: initialData.capacity ? String(initialData.capacity) : "1",
        sqft: initialData.sqft ? String(initialData.sqft) : "",
        callNumber: initialData.callNumber || "1800 123 77888",
        whatsappNumber: initialData.whatsappNumber || "8385973582",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        available: initialData.available !== undefined ? initialData.available : true,
        category: initialData.category || "STANDARD",
        isPopular: Boolean(initialData.isPopular),
        isPremium: Boolean(initialData.isPremium),
        isVirtualOffice: Boolean(initialData.isVirtualOffice),
      });

      if (Array.isArray(initialData.amenities) && initialData.amenities.length > 0) {
        setSelectedAmenities(initialData.amenities);
      }
      if (Array.isArray(initialData.images) && initialData.images.length > 0) {
        setGalleryImages(initialData.images);
      }
    } else {
      // Default initial state
      const defaultLoc = locations[0]?._id || "";
      const defaultType = types[0]?._id || "";

      setForm({
        name: "",
        workspaceType: defaultType,
        location: defaultLoc,
        price: "",
        pricingPeriod: "month",
        capacity: "1",
        sqft: "",
        callNumber: "1800 123 77888",
        whatsappNumber: "8385973582",
        description: "",
        imageUrl: "",
        available: true,
        category: "STANDARD",
        isPopular: false,
        isPremium: false,
        isVirtualOffice: false,
      });
      setSelectedAmenities([
        "High-Speed Fiber Wi-Fi",
        "Air Conditioning",
        "Unlimited Gourmet Coffee & Tea",
        "Printing & Scanning",
      ]);
      setGalleryImages([]);
    }
  }, [isOpen, initialData, locations, types]);

  // Lock Body Scroll when Modal is Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter Locations based on State & City
  const availableStates = Array.from(new Set(locations.map((l: any) => l.state || "Haryana").filter(Boolean)));
  const availableCities = getCitiesOfState(selectedState).length > 0
    ? getCitiesOfState(selectedState)
    : Array.from(new Set(locations.filter((l: any) => (l.state || "Haryana") === selectedState).map((l: any) => l.city || l.name).filter(Boolean)));

  const filteredLocations = locations.filter((l: any) => {
    const stMatch = (l.state || "Haryana").toLowerCase() === selectedState.toLowerCase();
    const ctMatch = (l.city || l.name || "").toLowerCase() === selectedCity.toLowerCase();
    return stMatch && ctMatch;
  });

  // Toggle Amenity Selection
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Add Custom Amenity
  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities([...selectedAmenities, trimmed]);
    }
    setCustomAmenityInput("");
  };

  // Remove Amenity
  const removeAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
  };

  // Main Image Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      showSuccessAlert("Cover Uploaded! 📸", "Front view attached successfully.");
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingMain(false);
    }
  };

  // Multiple Gallery Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (galleryImages.length + files.length > 6) {
      showErrorAlert("Limit Exceeded", "Maximum 6 inside gallery views allowed.");
      return;
    }
    setUploadingGallery(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await api.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGalleryImages((prev) => [...prev, ...res.data.urls].slice(0, 6));
      showSuccessAlert("Gallery Uploaded! 🖼️", `${res.data.urls.length} interior view(s) added.`);
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload gallery images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showErrorAlert("Missing Field", "Please enter workspace title/name.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      showErrorAlert("Missing Field", "Please enter a valid rental price.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        workspaceType: form.workspaceType,
        location: form.location,
        price: Number(form.price),
        pricingPeriod: form.pricingPeriod,
        capacity: Number(form.capacity) || 1,
        sqft: form.sqft ? Number(form.sqft) : undefined,
        callNumber: form.callNumber.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl,
        images: galleryImages,
        amenities: selectedAmenities,
        available: form.available,
      };

      if (!payload.location || payload.location.length !== 24) delete payload.location;
      if (!payload.workspaceType || payload.workspaceType.length !== 24) delete payload.workspaceType;

      if (initialData?._id) {
        await api.put(`/workspaces/${initialData._id}`, payload);
        showSuccessAlert(
          "Workspace Updated! ✏️",
          isSuperAdmin
            ? "Workspace changes updated live."
            : "Workspace update submitted for Super Admin approval."
        );
      } else {
        await api.post("/workspaces", payload);
        showSuccessAlert(
          isSuperAdmin ? "Workspace Published Live! 🚀" : "Workspace Submitted! 🚀",
          isSuperAdmin
            ? "Your workspace is now live on the public site."
            : "Your workspace has been submitted for Super Admin approval."
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      showErrorAlert("Submission Error", err?.response?.data?.message || "Failed to save workspace details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[999] overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-neutral-200 shadow-2xl overflow-hidden font-sans my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER BAR */}
        <div className="px-6 py-5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white leading-snug">
                {initialData ? "Edit Workspace Details" : "Add New Workspace Inventory"}
              </h3>
              <p className="text-xs text-neutral-400">
                Specify capacity, pricing, contact numbers, amenities &amp; gallery images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY FORM */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7 max-h-[80vh] overflow-y-auto">
          {/* SECTION 1: LOCATION & CATEGORY */}
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
              1. LOCATION &amp; CATEGORY SELECTION
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setSelectedState(st);
                    const cities = getCitiesOfState(st);
                    if (cities.length > 0) setSelectedCity(cities[0]);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {(availableStates.length > 0 ? availableStates : getIndianStates()).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  City *
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {availableCities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  Centre / Hub *
                </label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {(filteredLocations.length > 0 ? filteredLocations : locations).map((loc: any) => (
                    <option key={loc._id} value={loc._id}>
                      📍 {loc.area || loc.name} ({loc.city || loc.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: WORKSPACE NAME & TYPE */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
              2. WORKSPACE IDENTIFICATION &amp; TYPE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  Workspace Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Executive 10-Seater Glass Cabin"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  Workspace Type *
                </label>
                <select
                  value={form.workspaceType}
                  onChange={(e) => setForm({ ...form, workspaceType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {types.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe desk layout, acoustic privacy, natural lighting, suitable team size, and included perks..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-medium text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category & Badge Flags */}
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 font-mono block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CATEGORY &amp; PROMOTION BADGES
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Listing Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setForm({
                        ...form,
                        category: cat,
                        isPopular: cat === "POPULAR" ? true : form.isPopular,
                        isPremium: cat === "PREMIUM" ? true : form.isPremium,
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="STANDARD">Standard Workspace</option>
                    <option value="POPULAR">🔥 Popular Workspace</option>
                    <option value="PREMIUM">⭐ Premium Luxury Workspace</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                    <input
                      type="checkbox"
                      checked={form.isPopular}
                      onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    🔥 Popular Badge
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                    <input
                      type="checkbox"
                      checked={form.isPremium}
                      onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    ⭐ Premium Badge
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                    <input
                      type="checkbox"
                      checked={form.isVirtualOffice}
                      onChange={(e) => setForm({ ...form, isVirtualOffice: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    🌐 Virtual Office Package
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SPECIFICATIONS, CAPACITY & PRICING */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
              3. SPECIFICATIONS, CAPACITY &amp; PRICING
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Seating Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-bold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" /> Area (Sq Ft)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.sqft}
                  onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                  placeholder="e.g. 450"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-bold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Rental Price (INR) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 25000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono">
                  Billing Period *
                </label>
                <select
                  value={form.pricingPeriod}
                  onChange={(e) => setForm({ ...form, pricingPeriod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="month">Per Month (/ mo)</option>
                  <option value="day">Per Day (/ day)</option>
                  <option value="hour">Per Hour (/ hr)</option>
                  <option value="year">Per Year (/ yr)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: DIRECT CONTACT NUMBERS */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
              4. DIRECT CONTACT &amp; WHATSAPP NUMBERS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" /> Direct Call Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={form.callNumber}
                  onChange={(e) => setForm({ ...form, callNumber: e.target.value })}
                  placeholder="e.g. +91 9876543210 or 1800 123 77888"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Dialed directly when members click &quot;Call Support&quot;</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-mono flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Direct Chat Number *
                </label>
                <input
                  type="text"
                  required
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="e.g. 8385973582 or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-neutral-400 mt-1">Opens direct WhatsApp chat for workspace inquiries</p>
              </div>
            </div>
          </div>

          {/* SECTION 5: CORPORATE AMENITIES PICKER (CHECKBOXES + CUSTOM ADD) */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
                5. INCLUDED CORPORATE AMENITIES ({selectedAmenities.length} SELECTED)
              </span>
            </div>

            {/* Checkable Amenity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DEFAULT_PRESET_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? "bg-amber-500/10 border-amber-500 text-amber-950 font-bold shadow-xs"
                        : "bg-stone-50 border-neutral-200 text-neutral-700 hover:bg-stone-100 font-medium"
                    }`}
                  >
                    <span className="text-xs">{amenity}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ml-2 border ${
                        isChecked ? "bg-amber-600 border-amber-600 text-white" : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Custom Amenities Pills & Add Custom Amenity Field */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                + Add Custom Amenity (Extra Perks)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder="Type extra amenity e.g. Whiteboard, Gaming Lounge, Podcast Booth..."
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 bg-stone-50 text-xs font-semibold text-neutral-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shrink-0"
                >
                  + Add Amenity
                </button>
              </div>

              {/* Active Selected Amenities Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedAmenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      className="text-neutral-400 hover:text-rose-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: PROPERTY PHOTOS & 6 INTERIOR GALLERY VIEWS */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 font-mono block">
              6. PROPERTY PHOTOS &amp; 6 INTERIOR GALLERY VIEWS
            </span>

            {/* Main Front View Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                Main Front Cover View Image *
              </label>
              <div className="flex items-center gap-4">
                {form.imageUrl ? (
                  <div className="relative w-28 h-20 rounded-2xl overflow-hidden border border-neutral-300 shadow-sm shrink-0">
                    <img src={form.imageUrl} alt="Front Cover View" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: "" })}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-stone-50 hover:border-amber-500 transition cursor-pointer text-center">
                    {uploadingMain ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-amber-600 mb-1" />
                        <span className="text-xs font-bold text-neutral-900">Upload Main Front Cover Image</span>
                        <span className="text-[10px] text-neutral-400">JPG, PNG, WebP (High Resolution)</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* 6 Interior Gallery Views */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                  Inside Interior Gallery Views (Up to 6 Images)
                </label>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-mono">
                  {galleryImages.length} / 6 Uploaded
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                    <img src={url} alt={`Interior ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {galleryImages.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 bg-stone-50 hover:border-amber-500 transition flex flex-col items-center justify-center cursor-pointer text-center p-2">
                    {uploadingGallery ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-neutral-400 mb-1" />
                        <span className="text-[10px] font-bold text-neutral-600">Add View</span>
                      </>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SAAS STYLE SUBMISSION CARD */}
          <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm font-sans mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                    {isSuperAdmin ? "Ready to publish live workspace?" : "Ready to submit workspace for approval?"}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
                    {isSuperAdmin
                      ? "Workspace will go live immediately on the public website."
                      : "Review details carefully. Super Admin will verify specifications before publishing."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end shrink-0 gap-1.5">
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim() || !form.price}
                  className="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      Saving Workspace...
                    </>
                  ) : (
                    <>
                      {isSuperAdmin ? "Create & Publish Live Workspace" : "Submit Workspace For Approval"}
                      <span className="text-amber-400 font-normal text-sm ml-0.5">&rarr;</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-neutral-400 font-medium font-mono">
                  All fields saved securely
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
