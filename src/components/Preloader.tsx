"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none">
      {/* Circular Spinner Container */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-5">
        {/* Outer Circular Ring with Orange Arc */}
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 border-t-amber-600 animate-spin duration-700" />

        {/* Center Brand Icon */}
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
          <span className="font-serif font-black text-lg text-neutral-950 tracking-tighter">
            n<span className="text-amber-600 font-sans text-sm font-bold">x</span>
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xs font-semibold text-neutral-600 tracking-wide animate-pulse">
        Loading your workspace...
      </p>
    </div>
  );
}
