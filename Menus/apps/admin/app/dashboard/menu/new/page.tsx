"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  Image,
  Box,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  X,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { ModelUpload } from "@/components/uploads/model-upload";

const categories = ["Pizza", "Burgers", "Drinks", "Desserts", "Appetizers", "Salads", "Pasta", "Seafood"];
const allergenOptions = ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Fish", "Shellfish", "Sesame"];

export default function AddMenuItemPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [item, setItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    currency: "USD",
    is_available: true,
    calories: "",
    prep_time: "",
    ingredients: [] as string[],
    allergens: [] as string[],
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string>("");
  const [modelSizeMb, setModelSizeMb] = useState<number | null>(null);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState("");

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  };

  const handlePhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handlePhotoChange(file);
    }
  }, []);


  const addIngredient = () => {
    if (newIngredient.trim() && !item.ingredients.includes(newIngredient.trim())) {
      setItem({ ...item, ingredients: [...item.ingredients, newIngredient.trim()] });
      setNewIngredient("");
    }
  };

  const toggleAllergen = (allergen: string) => {
    setItem({
      ...item,
      allergens: item.allergens.includes(allergen)
        ? item.allergens.filter((a) => a !== allergen)
        : [...item.allergens, allergen],
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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

      const itemId = crypto.randomUUID();
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      let imageUrl = null;
      let finalModelUrl = modelUrl || "pending";

      if (photo) {
        const photoPath = `${orgId}/${itemId}/${photo.name}`;
        const { error: photoErr } = await supabase.storage
          .from("images")
          .upload(photoPath, photo, { upsert: true });
        if (photoErr) throw photoErr;
        const { data: pubData } = supabase.storage.from("images").getPublicUrl(photoPath);
        imageUrl = pubData.publicUrl;
      }

      const { error: insertErr } = await supabase
        .from("menu_items")
        .insert({
          id: itemId,
          location_id: locationId,
          name: item.name,
          slug,
          description: item.description,
          category: item.category,
          price: Number(item.price),
          currency: item.currency,
          is_available: item.is_available,
          calories: item.calories ? Number(item.calories) : null,
          allergens: item.allergens.length > 0 ? item.allergens : null,
          image_url: imageUrl,
          model_url: finalModelUrl,
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

  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Photo" },
    { num: 3, label: "3D Model" },
    { num: 4, label: "Details" },
    { num: 5, label: "Review" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Menu Item</h1>
        <p className="text-sm text-neutral-400 mt-1">Create an AR-enabled food item for your menu</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${i < steps.length - 1 ? "flex-1" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s.num
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white shadow-md shadow-orange-500/20"
                  : "bg-white/[0.04] border border-white/[0.08] text-neutral-500"
              }`}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? "text-white" : "text-neutral-500"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${step > s.num ? "bg-[#FF6B00]/50" : "bg-white/[0.06]"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-300">Item Name *</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              placeholder="Margherita Pizza"
              className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-300">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              placeholder="Fresh mozzarella, San Marzano tomatoes, basil..."
              rows={3}
              className="flex w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-neutral-300">Category</label>
              <select
                value={item.category}
                onChange={(e) => setItem({ ...item, category: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all appearance-none"
              >
                <option value="" className="bg-neutral-900">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()} className="bg-neutral-900">{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-neutral-300">Price *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => setItem({ ...item, price: e.target.value })}
                  placeholder="12.99"
                  className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-8 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition-colors ${item.is_available ? "bg-[#FF6B00]" : "bg-white/[0.1]"} relative`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${item.is_available ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-neutral-300">Available for customers</span>
          </label>
        </div>
      )}

      {/* Step 2: Photo Upload */}
      {step === 2 && (
        <div className="max-w-xl mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-[#FF8A33]" />
              <h3 className="font-semibold text-white">Food Photo</h3>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePhotoDrop}
              className="relative border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-[#FF6B00]/30 transition-colors cursor-pointer"
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePhotoChange(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                  <p className="text-sm text-neutral-400 mb-1">Drag & drop food photo</p>
                  <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              />
            </div>
        </div>
      )}

      {/* Step 3: 3D Model Optimization */}
      {step === 3 && (
        <div className="max-w-xl mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">3D Model Optimization</h3>
            <p className="text-sm text-neutral-400">Upload a GLB file. It will be automatically optimized and compressed for mobile AR.</p>
          </div>
          
          <ModelUpload
            value={modelUrl}
            onChange={(url, size) => {
              setModelUrl(url);
              if (size) setModelSizeMb(size);
            }}
            onUploadingChange={setIsUploadingModel}
          />
          
          {modelUrl && modelSizeMb && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-400">Optimization Complete</p>
                <p className="text-xs text-green-500/80 mt-0.5">Final size: {modelSizeMb} MB. Ready for AR viewing!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Details */}
      {step === 4 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-neutral-300">Calories</label>
              <input
                type="number"
                value={item.calories}
                onChange={(e) => setItem({ ...item, calories: e.target.value })}
                placeholder="450"
                className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-neutral-300">Prep Time (min)</label>
              <input
                type="number"
                value={item.prep_time}
                onChange={(e) => setItem({ ...item, prep_time: e.target.value })}
                placeholder="15"
                className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <label className="text-[13px] font-medium text-neutral-300">Ingredients</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                placeholder="Add ingredient..."
                className="flex h-10 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/40 transition-all"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="h-10 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {item.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-neutral-300"
                  >
                    {ing}
                    <button
                      onClick={() => setItem({ ...item, ingredients: item.ingredients.filter((_, idx) => idx !== i) })}
                      className="text-neutral-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Allergens */}
          <div className="space-y-3">
            <label className="text-[13px] font-medium text-neutral-300">Allergens</label>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((allergen) => (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.allergens.includes(allergen)
                      ? "bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF8A33]"
                      : "bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.12]"
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
          <h3 className="font-semibold text-white">Review Your Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preview Card */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-white/[0.02] flex items-center justify-center">
                  <Image className="w-10 h-10 text-neutral-600" />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-white">{item.name || "Untitled"}</h4>
                <p className="text-xs text-neutral-400 capitalize mt-0.5">{item.category || "No category"}</p>
                <p className="text-lg font-bold text-[#FF8A33] mt-2">${item.price || "0.00"}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500">Description</span>
                <p className="text-sm text-neutral-300 mt-1">{item.description || "No description"}</p>
              </div>
              {item.calories && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500">Calories</span>
                  <p className="text-sm text-white mt-1">{item.calories} kcal</p>
                </div>
              )}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500">Media</span>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-neutral-300 flex items-center gap-2">
                    <Image className="w-3.5 h-3.5" />
                    {photo ? photo.name : "No photo"}
                  </p>
                  <p className="text-sm text-neutral-300 flex items-center gap-2">
                    <Box className="w-3.5 h-3.5" />
                    {modelUrl ? `Optimized Model (${modelSizeMb ? modelSizeMb + ' MB' : 'Ready'})` : "No 3D model"}
                  </p>
                </div>
              </div>
              {item.allergens.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500">Allergens</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.allergens.map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 3 && isUploadingModel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !item.name}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Item
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
