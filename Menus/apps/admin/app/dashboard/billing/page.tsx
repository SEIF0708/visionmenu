"use client";

import { useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  Download,
  Calendar,
  ChevronRight,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Get started with AR menus",
    features: ["5 menu items", "500 scans / month", "Standard AR viewing", "Universal mobile support"],
    color: "border-white/[0.06]",
    btnClass: "bg-white/[0.06] border border-white/[0.08] text-neutral-300 hover:bg-white/[0.1]",
    icon: Zap,
    current: false,
  },
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    desc: "For growing restaurants",
    features: ["25 menu items", "5,000 scans / month", "Standard AR viewing", "Basic analytics", "QR customization"],
    color: "border-white/[0.08]",
    btnClass: "bg-white/[0.06] border border-white/[0.08] text-neutral-300 hover:bg-white/[0.1]",
    icon: Building2,
    current: false,
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    desc: "Full AR menu experience",
    features: ["100 menu items", "25,000 scans / month", "High-fidelity PBR rendering", "Full analytics suite", "White-label branding", "Priority support"],
    color: "border-[#FF6B00]/30",
    btnClass: "bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white shadow-lg shadow-orange-500/20",
    icon: Crown,
    current: true,
    popular: true,
  },
];

const invoices = [
  { date: "May 1, 2025", amount: "$99.00", status: "Paid", id: "INV-2025-0501" },
  { date: "Apr 1, 2025", amount: "$99.00", status: "Paid", id: "INV-2025-0401" },
  { date: "Mar 1, 2025", amount: "$99.00", status: "Paid", id: "INV-2025-0301" },
  { date: "Feb 1, 2025", amount: "$99.00", status: "Paid", id: "INV-2025-0201" },
];

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your plan, payments, and invoices</p>
      </div>

      {/* Current Plan Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FF6B00]/10 via-[#FF8A33]/5 to-transparent border border-[#FF6B00]/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center">
            <Crown className="w-6 h-6 text-[#FF8A33]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Premium Plan</h3>
            <p className="text-sm text-neutral-400">$99/month &middot; Renews June 1, 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-neutral-300 hover:text-white transition-all">
            Cancel Plan
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-neutral-300 hover:text-white transition-all">
            Change Plan
          </button>
        </div>
      </div>

      {/* Usage Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Menu Items", used: 42, max: 100, unit: "items" },
          { label: "Monthly Scans", used: 12840, max: 25000, unit: "scans" },
          { label: "Storage Used", used: 2.4, max: 10, unit: "GB" },
        ].map((meter) => {
          const percent = (meter.used / meter.max) * 100;
          return (
            <div key={meter.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-neutral-400">{meter.label}</span>
                <span className="text-[11px] text-neutral-500">
                  {meter.used.toLocaleString()} / {meter.max.toLocaleString()} {meter.unit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    percent > 80 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-[#FF6B00] to-[#FF8A33]"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">{percent.toFixed(0)}% used</p>
            </div>
          );
        })}
      </div>

      {/* Plan Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Available Plans</h2>
          <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#FF6B00]/15 text-[#FF8A33] border border-[#FF6B00]/20"
                  : "text-neutral-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-[#FF6B00]/15 text-[#FF8A33] border border-[#FF6B00]/20"
                  : "text-neutral-400"
              }`}
            >
              Yearly (-20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white/[0.02] border ${plan.color} p-6 flex flex-col ${plan.popular ? "ring-1 ring-[#FF6B00]/20" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-[10px] font-bold uppercase tracking-wider text-white">
                    Current Plan
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-[#FF8A33]" />
                  <span className="font-semibold text-white">{plan.name}</span>
                </div>
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-neutral-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-5">{plan.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <Check className="w-3.5 h-3.5 text-[#FF8A33] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${plan.btnClass}`}>
                  {plan.current ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Payment Method</h2>
          <button className="text-xs text-[#FF8A33] hover:text-[#FF6B00] transition-colors font-medium">
            Update
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Visa ending in 4242</p>
            <p className="text-[11px] text-neutral-500">Expires 12/2026</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Default
          </span>
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Invoice History</h2>
          <button className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <div>
                  <p className="text-sm text-white">{inv.date}</p>
                  <p className="text-[11px] text-neutral-500">{inv.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white">{inv.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{inv.status}</span>
                <button className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
