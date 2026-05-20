"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { ImageUpload } from "@/components/uploads/image-upload";
import { ModelUpload } from "@/components/uploads/model-upload";

interface MenuItemFormProps {
  item: any;
  isNew: boolean;
  locationId: string;
}

export function MenuItemForm({ item, isNew, locationId }: MenuItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const uploading = uploadCount > 0;

  const trackUpload = (active: boolean) => {
    setUploadCount((n) => Math.max(0, n + (active ? 1 : -1)));
  };
  const [formError, setFormError] = useState<string | null>(null);
  const [modelSizeMb, setModelSizeMb] = useState<number | undefined>(
    item?.model_size_mb ? Number(item.model_size_mb) : undefined
  );
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const [form, setForm] = useState({
    name: item?.name || "",
    slug: item?.slug || "",
    description: item?.description || "",
    category: item?.category || "",
    price: item?.price?.toString() || "",
    calories: item?.calories?.toString() || "",
    allergens: item?.allergens?.join(", ") || "",
    dietary_tags: item?.dietary_tags?.join(", ") || "",
    image_url: item?.image_url || "",
    model_url: item?.model_url || "",
    is_available: item?.is_available ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.model_url?.trim()) {
      setFormError("Upload a 3D model (GLB) before saving.");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      category: form.category || null,
      price: form.price ? parseFloat(form.price) : null,
      calories: form.calories ? parseInt(form.calories) : null,
      allergens: form.allergens
        ? form.allergens.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      dietary_tags: form.dietary_tags
        ? form.dietary_tags.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      image_url: form.image_url || null,
      model_url: form.model_url,
      model_size_mb: modelSizeMb ?? null,
      is_available: form.is_available,
      published_at: isNew ? new Date().toISOString() : item?.published_at,
    };

    const supabase = createClient();

    if (isNew) {
      const { error } = await supabase.from("menu_items").insert({
        ...payload,
        location_id: locationId,
      });
      if (error) {
        setFormError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", item.id);
      if (error) {
        setFormError(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard/menu");
    router.refresh();
  };

  const isBusy = loading || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
                slug: slugify(e.target.value),
              })
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm font-medium">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm mt-1 min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          >
            <option value="">Select category</option>
            <option value="appetizer">Appetizer</option>
            <option value="main">Main</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Calories</label>
          <input
            type="number"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Available</label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) =>
                setForm({ ...form, is_available: e.target.checked })
              }
              className="h-4 w-4"
            />
            <span className="text-sm">Item is available</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          Allergens{" "}
          <span className="text-muted-foreground">(comma separated)</span>
        </label>
        <input
          value={form.allergens}
          onChange={(e) => setForm({ ...form, allergens: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          placeholder="dairy, gluten, nuts"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Dietary Tags{" "}
          <span className="text-muted-foreground">(comma separated)</span>
        </label>
        <input
          value={form.dietary_tags}
          onChange={(e) => setForm({ ...form, dietary_tags: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
          placeholder="vegan, vegetarian, gluten-free"
        />
      </div>

      <ImageUpload
        value={form.image_url}
        onChange={(url) => setForm({ ...form, image_url: url })}
        onUploadingChange={trackUpload}
      />

      <ModelUpload
        value={form.model_url}
        required
        onUploadingChange={trackUpload}
        onChange={(url, sizeMb) => {
          setForm({ ...form, model_url: url });
          if (sizeMb !== undefined) setModelSizeMb(sizeMb);
        }}
      />

      <details
        className="text-sm"
        open={showUrlFallback}
        onToggle={(e) => setShowUrlFallback((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Advanced: paste URLs instead
        </summary>
        <div className="mt-3 space-y-3 pl-1">
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">3D Model URL</label>
              <input
                value={form.model_url}
                onChange={(e) =>
                  setForm({ ...form, model_url: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mt-1"
                placeholder="https://.../model.glb"
              />
            </div>
          </div>
      </details>

      {formError && (
        <p className="text-sm text-destructive">{formError}</p>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isBusy}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : isNew ? "Create Item" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/menu")}
          className="border border-input px-6 py-2 rounded-md text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
