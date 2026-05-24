"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Globe,
  Users,
  Upload,
  Save,
  Loader2,
  Eye,
  Monitor,
} from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage your restaurant preferences and branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#FF6B00]/15 to-[#FF8A33]/5 text-[#FF8A33] border border-[#FF6B00]/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <form onSubmit={handleSave} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-1">General Settings</h3>
                <p className="text-xs text-neutral-500">Basic restaurant information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-neutral-300">Restaurant Name</label>
                  <input
                    defaultValue="Demo Pizzeria"
                    className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-neutral-300">Menu URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">ar-menu.com/</span>
                    <input
                      defaultValue="demo-pizzeria"
                      className="flex h-11 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-neutral-300">Language</label>
                    <select className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 transition-all appearance-none">
                      <option value="en" className="bg-neutral-900">English</option>
                      <option value="es" className="bg-neutral-900">Spanish</option>
                      <option value="fr" className="bg-neutral-900">French</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-neutral-300">Currency</label>
                    <select className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 transition-all appearance-none">
                      <option value="USD" className="bg-neutral-900">USD ($)</option>
                      <option value="EUR" className="bg-neutral-900">EUR (&euro;)</option>
                      <option value="GBP" className="bg-neutral-900">GBP (&pound;)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "branding" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-1">Brand Identity</h3>
                  <p className="text-xs text-neutral-500">Customize your restaurant&apos;s visual identity</p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-neutral-300">Restaurant Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      <Upload className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div>
                      <button className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-neutral-300 hover:text-white transition-colors">
                        Upload Logo
                      </button>
                      <p className="text-[11px] text-neutral-500 mt-1.5">PNG, SVG. Recommended 200x200px</p>
                    </div>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-neutral-300">Brand Colors</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Primary", color: "#FF6B00" },
                      { label: "Secondary", color: "#1A1A2E" },
                      { label: "Accent", color: "#FF8A33" },
                      { label: "Background", color: "#050505" },
                    ].map((c) => (
                      <div key={c.label} className="space-y-2">
                        <div
                          className="w-full h-12 rounded-xl border border-white/[0.08] cursor-pointer"
                          style={{ backgroundColor: c.color }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-neutral-400">{c.label}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{c.color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-neutral-300">Typography</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-neutral-500">Heading Font</span>
                      <select className="flex h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 transition-all appearance-none">
                        <option className="bg-neutral-900">Poppins</option>
                        <option className="bg-neutral-900">Inter</option>
                        <option className="bg-neutral-900">Space Grotesk</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-neutral-500">Body Font</span>
                      <select className="flex h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-[#FF6B00]/40 transition-all appearance-none">
                        <option className="bg-neutral-900">Inter</option>
                        <option className="bg-neutral-900">DM Sans</option>
                        <option className="bg-neutral-900">Outfit</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-neutral-400" />
                  <h3 className="font-semibold text-white text-sm">Live Preview</h3>
                </div>
                <div className="rounded-xl bg-[#050505] border border-white/[0.06] p-6 flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A33] flex items-center justify-center font-black text-white text-sm mx-auto mb-3">
                      AR
                    </div>
                    <p className="text-sm font-semibold text-white">Demo Pizzeria</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Your branded menu</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-1">Notification Preferences</h3>
                <p className="text-xs text-neutral-500">Choose what alerts you receive</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "New QR scan alerts", desc: "Get notified when customers scan your QR codes", enabled: true },
                  { label: "Weekly analytics report", desc: "Receive a summary of your menu performance", enabled: true },
                  { label: "AR engagement milestones", desc: "Celebrate when you hit engagement goals", enabled: false },
                  { label: "System updates", desc: "Important platform updates and features", enabled: true },
                  { label: "Marketing emails", desc: "Tips, best practices, and promotions", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-medium text-white">{notif.label}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{notif.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${notif.enabled ? "bg-[#FF6B00]" : "bg-white/[0.1]"} relative`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notif.enabled ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Team Members</h3>
                  <p className="text-xs text-neutral-500">Manage who has access to your dashboard</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all">
                  <Users className="w-3.5 h-3.5" />
                  Invite
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "John Smith", email: "john@demo.com", role: "Owner", avatar: "JS" },
                  { name: "Sarah Chen", email: "sarah@demo.com", role: "Admin", avatar: "SC" },
                  { name: "Mike Wilson", email: "mike@demo.com", role: "Viewer", avatar: "MW" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{member.name}</p>
                        <p className="text-[11px] text-neutral-500">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-400">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
