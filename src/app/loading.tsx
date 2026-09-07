export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      {/* Circular Spinner Container */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Outer Circular Ring with Orange Arc */}
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 border-t-amber-600 animate-spin duration-700" />

        {/* Center Brand Icon */}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner">
          <span className="font-serif font-black text-xl text-neutral-900 tracking-tighter">
            n<span className="text-amber-600 font-sans text-base font-bold">x</span>
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-sm font-semibold text-neutral-600 tracking-wide animate-pulse">
        Loading your workspace...
      </p>
    </div>
  );
}
