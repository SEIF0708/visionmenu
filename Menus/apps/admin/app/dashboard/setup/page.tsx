"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardSetupPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/setup-organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setError(json.error ?? "Could not set up restaurant");
      setLoading(false);
      return;
    }

    router.push("/dashboard/menu/new");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold">Finish restaurant setup</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your account is signed in, but your restaurant profile is not linked yet.
          This one-time step unlocks Menu, uploads, and QR codes.
        </p>
      </div>

      <form onSubmit={handleSetup} className="space-y-4 rounded-lg border p-6">
        <div>
          <label htmlFor="restaurantName" className="text-sm font-medium">
            Restaurant name
          </label>
          <input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
            placeholder="My Pizzeria"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Complete setup"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground">
        If this keeps failing, run{" "}
        <code className="text-foreground">004_fix_member_access.sql</code> in
        Supabase SQL Editor, then try again.
      </p>

      <Link href="/dashboard" className="text-sm text-primary hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
