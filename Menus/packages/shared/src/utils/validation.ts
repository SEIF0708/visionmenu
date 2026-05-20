import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  price: z.number().positive().max(99999.99).optional(),
  category: z.enum(["appetizer", "main", "dessert", "drink"]).optional(),
  calories: z.number().int().positive().optional(),
  allergens: z.array(z.string()).optional(),
  dietary_tags: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  model_url: z.string().url(),
  model_format: z.enum(["glb", "usdz"]).default("glb"),
  model_size_mb: z.number().positive().optional(),
});

export const analyticsEventSchema = z.object({
  eventType: z.enum(["view", "ar_open", "ar_error", "order_click"]),
  menuItemId: z.string().uuid(),
  sessionId: z.string().min(1),
  deviceType: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
  userAgent: z.string().optional(),
  loadTimeMs: z.number().int().optional(),
  modelLoadTimeMs: z.number().int().optional(),
  countryCode: z.string().max(2).optional(),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  restaurantName: z.string().min(1).max(100),
});
