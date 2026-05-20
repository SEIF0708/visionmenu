"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <div className="max-w-lg mx-auto space-y-4 py-12">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        {error.message || "Could not load this page."}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/dashboard/setup"
          className="border border-input px-4 py-2 rounded-md text-sm font-medium hover:bg-muted"
        >
          Finish setup
        </Link>
        <Link
          href="/dashboard/menu"
          className="border border-input px-4 py-2 rounded-md text-sm font-medium hover:bg-muted"
        >
          Menu
        </Link>
      </div>
    </div>
  );
}
