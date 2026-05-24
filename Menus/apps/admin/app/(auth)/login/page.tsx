import { Suspense } from "react";
import { LoginForm } from "./login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#050505] overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF6B00]/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6B00]/[0.03] blur-[130px] pointer-events-none" />
      
      {/* Grain overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/25">
            AR
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">AR Menu</span>
        </div>

        {/* Glass card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-neutral-400 mt-1.5">Sign in to manage your restaurant</p>
          </div>

          <Suspense fallback={
            <div className="space-y-4">
              <div className="h-10 rounded-lg skeleton-shimmer" />
              <div className="h-10 rounded-lg skeleton-shimmer" />
              <div className="h-10 rounded-lg skeleton-shimmer" />
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-neutral-500 mt-6">
          New restaurant?{" "}
          <Link href="/signup" className="text-[#FF8A33] hover:text-[#FF6B00] font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
