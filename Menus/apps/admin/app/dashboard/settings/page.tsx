"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Restaurant Name</label>
          <input
            defaultValue="Demo Pizzeria"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Primary Color</label>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="color"
              defaultValue="#E31837"
              className="h-9 w-16 rounded border"
            />
            <input
              defaultValue="#E31837"
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm flex-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Logo URL</label>
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
            placeholder="https://images.example.com/logo.png"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      <div className="border-t pt-6">
        <h2 className="font-semibold mb-2">Subscription</h2>
        <p className="text-sm text-muted-foreground">
          Current plan: <span className="font-medium text-foreground">Premium</span>
        </p>
        <p className="text-sm text-muted-foreground">
          25,000 scans remaining this month
        </p>
      </div>
    </div>
  );
}
