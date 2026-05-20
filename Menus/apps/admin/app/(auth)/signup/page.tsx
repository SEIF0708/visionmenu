"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, restaurantName }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      const msg =
        typeof json.error === "string"
          ? json.error
          : Object.values(json.error ?? {}).flat().join(", ") || "Signup failed";
      setError(msg);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        "Account created. Please sign in with your email and password."
      );
      setLoading(false);
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-950 text-neutral-50 dark">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Start your AR menu in minutes
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-neutral-200">
              Your name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-neutral-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="restaurantName" className="text-sm font-medium text-neutral-200">
              Restaurant name
            </label>
            <input
              id="restaurantName"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-neutral-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-neutral-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-neutral-700 text-white"
              minLength={8}
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              At least 8 characters
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
