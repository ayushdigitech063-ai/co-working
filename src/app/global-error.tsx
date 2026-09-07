"use client";

import Error from "next/error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-neutral-900">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button
              onClick={() => (typeof reset === "function" ? reset() : window.location.reload())}
              className="px-6 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
