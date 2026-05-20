"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "◆" },
  { href: "/dashboard/menu", label: "Menu", icon: "☰" },
  { href: "/dashboard/menu/new", label: "Add Item", icon: "+" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { href: "/dashboard/qr-codes", label: "QR Codes", icon: "■" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
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

  return (
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "w-64 border-r bg-muted/30 flex-shrink-0",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transform max-md:transition-transform",
          sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg">AR Menu</h2>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center px-6 gap-4">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex-1" />
          {userSlot}
          <SignOutButton />
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
