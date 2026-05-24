"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  BarChart3,
  QrCode,
  Settings,
  CreditCard,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/dashboard/menu/new", label: "Add Item", icon: PlusCircle },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/qr-codes", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function DashboardShell({
  children,
  userSlot,
}: {
  children: ReactNode;
  userSlot?: ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Sidebar */}
      <aside
        className={cn(
          "w-[260px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0A0A0F]",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transform max-md:transition-transform max-md:duration-300",
          sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-orange-500/20">
            AR
          </div>
          <div>
            <h2 className="font-bold text-[15px] text-white tracking-tight">AR Menu</h2>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B00]/15 to-[#FF8A33]/5 text-[#FF8A33] border border-[#FF6B00]/20 shadow-sm shadow-orange-500/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={cn("w-[18px] h-[18px]", isActive && "text-[#FF6B00]")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="rounded-xl bg-gradient-to-br from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF8A33]" />
              <span className="text-xs font-semibold text-white">Pro Plan</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Unlock advanced analytics and unlimited AR items.
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-3 block text-center text-[11px] font-semibold text-[#FF6B00] hover:text-[#FF8A33] transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/[0.06] flex items-center px-6 gap-4 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30">
          <button
            type="button"
            className="md:hidden w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search menu items, analytics..."
                className="w-full h-9 pl-10 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B00]/30 focus:ring-1 focus:ring-[#FF6B00]/20 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 bg-white/[0.06] px-1.5 py-0.5 rounded border border-white/[0.08]">
                /
              </kbd>
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF6B00]" />
            </button>
            {userSlot}
            <SignOutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
