import Link from "next/link";
import { QrCode, Smartphone, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-[#050505] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6B00]/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#FF6B00]/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center font-black text-white text-xl shadow-xl shadow-orange-500/25 mx-auto mb-8">
          AR
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          AR Menu
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          Experience restaurant menus in augmented reality. See your food before you order.
        </p>

        {/* Scan CTA */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm p-8 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-6 h-6 text-[#FF8A33]" />
          </div>
          <h2 className="font-semibold text-white mb-2">Scan to Start</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Scan a QR code from your restaurant table to view the menu and experience food in 3D AR.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
            <Smartphone className="w-5 h-5 text-[#FF8A33] mx-auto mb-2" />
            <p className="text-[11px] text-neutral-400">No app needed</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center">
            <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-[11px] text-neutral-400">3D AR Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
