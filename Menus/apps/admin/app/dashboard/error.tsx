"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowRight } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-sm text-neutral-400 mb-6">
        {error.message || "Could not load this page."}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/dashboard/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-neutral-300 hover:text-white transition-all"
        >
          Finish setup
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-neutral-300 hover:text-white transition-all"
        >
          Menu
        </Link>
      </div>
    </div>
  );
}
