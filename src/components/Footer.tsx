"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { api } from "@/services/api";

function toSlug(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Footer({ initialLocations }: { initialLocations?: any[] }) {
  const [locations, setLocations] = useState<any[]>(initialLocations || []);
  const [supportPhone, setSupportPhone] = useState<string>("1800 123 77888");

  useEffect(() => {
    // 1. Fetch from LocalStorage for instant render
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexushub_support_phone");
      if (stored) setSupportPhone(stored);
    }

    // 2. Fetch live settings from Backend API
    api.get("/settings")
      .then((res) => {
        if (res.data?.data?.supportPhone) {
          const apiPhone = res.data.data.supportPhone;
          setSupportPhone(apiPhone);
          if (typeof window !== "undefined") {
            localStorage.setItem("nexushub_support_phone", apiPhone);
          }
        }
      })
      .catch(() => {});

    const handlePhoneUpdate = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nexushub_support_phone");
        if (stored) setSupportPhone(stored);
      }
    };

    window.addEventListener("nexushub_phone_updated", handlePhoneUpdate);
    window.addEventListener("storage", handlePhoneUpdate);
    return () => {
      window.removeEventListener("nexushub_phone_updated", handlePhoneUpdate);
      window.removeEventListener("storage", handlePhoneUpdate);
    };
  }, []);

  useEffect(() => {
    if (!initialLocations || initialLocations.length === 0) {
      api
        .get("/locations?limit=50")
        .then((res) => {
          const locsData = res.data.data;
          const locList = Array.isArray(locsData) ? locsData : locsData?.content || [];
          setLocations(locList);
        })
        .catch((err) => console.error("Failed to load footer locations:", err));
    }
  }, [initialLocations]);

  // Extract unique Cities & States dynamically created in database
  const dynamicCities = (() => {
    const map = new Map<string, { city: string; state: string; area?: string; seoUrl: string }>();
    (locations || []).forEach((loc) => {
      const city = loc.city || loc.name;
      const state = loc.state || "Haryana";
      const area = loc.area || "";
      if (city && !map.has(city.toLowerCase())) {
        const seoUrl = `/locations/${toSlug(state)}/${toSlug(city)}${area ? `/${toSlug(area)}` : ""}`;
        map.set(city.toLowerCase(), { city, state, area, seoUrl });
      }
    });
    return Array.from(map.values()).slice(0, 6);
  })();

  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800 font-sans">
      {/* Top CTA Banner inside Footer */}
      <div className="border-b border-neutral-800 py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-1.5 sm:space-y-2 max-w-xl text-center lg:text-left">
              <span className="text-amber-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest font-mono">
                READY TO ELEVATE YOUR WORKSPACE?
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                Find your space today.
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm">
                Schedule a tour or talk to our workspace consultants for customized enterprise solutions.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/workspaces"
                className="flex-1 sm:flex-initial px-4 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-neutral-200 transition shadow-md text-center whitespace-nowrap"
              >
                Explore Workspaces
              </Link>
              <a
                href={`tel:${supportPhone.replace(/\s+/g, "")}`}
                className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 border border-neutral-700 whitespace-nowrap"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {supportPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-12 w-auto overflow-hidden rounded-xl bg-white p-1">
                <img
                  src="/logo.jpg"
                  alt="Sumit's Co-Working Space Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed font-medium">
              India&apos;s leading provider of premium, flexible, and fully managed workspaces. Empowering startups, enterprises, and professionals.
            </p>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 font-mono">SOLUTIONS</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-medium">
              <li><Link href="/workspaces/type/hot-desk" className="hover:text-white transition">Hot Desks</Link></li>
              <li><Link href="/workspaces/type/dedicated-desk" className="hover:text-white transition">Dedicated Desks</Link></li>
              <li><Link href="/workspaces/type/private-cabin" className="hover:text-white transition">Private Offices</Link></li>
              <li><Link href="/workspaces/type/meeting-room" className="hover:text-white transition">Meeting Rooms</Link></li>
              <li><Link href="/workspaces/type/virtual-office" className="hover:text-white transition">Virtual Offices</Link></li>
            </ul>
          </div>

          {/* DYNAMIC TOP CITIES (CONTROLLED BY SUPER ADMIN & LIVE DB) */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 font-mono">TOP CITIES</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-medium">
              {dynamicCities.length === 0 ? (
                <>
                  <li><Link href="/locations/haryana/panipat" className="hover:text-white transition">Panipat (Sector 11)</Link></li>
                  <li><Link href="/locations/karnataka/hubballi" className="hover:text-white transition">Hubballi (Keshwapur)</Link></li>
                  <li><Link href="/locations/karnataka/bengaluru" className="hover:text-white transition">Bengaluru (Marathahalli)</Link></li>
                  <li><Link href="/locations/rajasthan/jaipur" className="hover:text-white transition">Jaipur (Malviya Nagar)</Link></li>
                </>
              ) : (
                dynamicCities.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.seoUrl} className="hover:text-white transition flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.city} {item.area ? `(${item.area})` : ""}</span>
                    </Link>
                  </li>
                ))
              )}
              <li className="pt-1">
                <Link
                  href="/locations"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition inline-flex items-center gap-1 hover:underline font-mono"
                >
                  View All Cities &amp; Locations &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 font-mono">COMPANY</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-medium">
              <li><Link href="/" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/workspaces" className="hover:text-white transition">Enterprise Plans</Link></li>
              <li><Link href="/investor-relations" className="hover:text-white transition">Investor Relations</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Member Sign In</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4 font-medium">
          <p>&copy; {new Date().getFullYear()} NexusHub India Workplace Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
