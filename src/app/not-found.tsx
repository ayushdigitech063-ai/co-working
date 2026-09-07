"use client";

import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-neutral-900">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
        <p className="text-neutral-600 mb-6">The page you are looking for does not exist.</p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
