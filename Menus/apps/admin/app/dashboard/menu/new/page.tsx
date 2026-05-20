"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AddMenuItemPage() {
  const router = useRouter();
  const supabase = createClient();

  const [item, setItem] = useState({
    name: "",
    category: "",
    price: "",
    currency: "USD",
    is_available: true,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [model, setModel] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch user's organization and location
      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();
      if (roleError || !roleRow) throw new Error("Organization not found");
      const orgId = roleRow.organization_id;

      const { data: locRow, error: locError } = await supabase
        .from("locations")
        .select("id")
        .eq("organization_id", orgId)
        .single();
      if (locError || !locRow) throw new Error("Location not found");
      const locationId = locRow.id;

      // Generate ID and Slug upfront
      const itemId = crypto.randomUUID();
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      let imageUrl = null;
      let modelUrl = "pending";

      // Upload photo if provided
      if (photo) {
        const photoPath = `${orgId}/${itemId}/${photo.name}`;
        const { error: photoErr } = await supabase.storage
          .from("images")
          .upload(photoPath, photo, { upsert: true });
        if (photoErr) throw photoErr;
        
        const { data: pubData } = supabase.storage.from("images").getPublicUrl(photoPath);
        imageUrl = pubData.publicUrl;
      }

      // Upload GLB model if provided
      if (model) {
        const modelPath = `${orgId}/${itemId}/${model.name}`;
        const { error: modelErr } = await supabase.storage
          .from("models")
          .upload(modelPath, model, { upsert: true });
        if (modelErr) throw modelErr;
        
        const { data: pubData } = supabase.storage.from("models").getPublicUrl(modelPath);
        modelUrl = pubData.publicUrl;
      }

      // Insert menu item with required fields
      const { error: insertErr } = await supabase
        .from("menu_items")
        .insert({
          id: itemId,
          location_id: locationId,
          name: item.name,
          slug,
          category: item.category,
          price: Number(item.price),
          currency: item.currency,
          is_available: item.is_available,
          image_url: imageUrl,
          model_url: modelUrl,
          published_at: new Date().toISOString(),
        });
      
      if (insertErr) throw insertErr;

      router.push("/dashboard/menu");
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-neutral-50">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-neutral-900 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Add New Menu Item</h1>
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Item name"
            value={item.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-50"
          />
          <input
            name="category"
            placeholder="Category"
            value={item.category}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-50"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={item.price}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-neutral-50"
          />
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={item.is_available}
              onChange={() => setItem({ ...item, is_available: !item.is_available })}
            />
            <span>Available</span>
          </label>
          <label className="block">
            <span className="text-sm">Photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="mt-1 w-full"
            />
          </label>
          <label className="block">
            <span className="text-sm">3D Model .glb (optional)</span>
            <input
              type="file"
              accept=".glb"
              onChange={(e) => setModel(e.target.files?.[0] ?? null)}
              className="mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-2 font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Create Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
