"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Calendar,
  Radio,
  Download,
  Sparkles,
  LifeBuoy,
  Cpu,
  BarChart3,
  Tag,
  Mail,
  DollarSign,
  ShieldAlert,
  Building2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { SOLTO_THEME } from "@/lib/theme";

interface Brand {
  id: string;
  name: string;
  logoText: string;
  primaryColor: string;
}

export function Navigation() {
  const pathname = usePathname();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState("brand_default");

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBrands(d.brands);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: "Inbox", href: "/inbox", icon: Inbox },
    { label: "Tickets", href: "/tickets", icon: LifeBuoy },
    { label: "QA Automations", href: "/automations", icon: Cpu },
    { label: "Reporting", href: "/analytics", icon: BarChart3 },
    { label: "Paid Ads", href: "/campaigns", icon: DollarSign },
    { label: "Governance", href: "/governance", icon: ShieldAlert },
    { label: "Multi-Brand", href: "/brands", icon: Building2 },
    { label: "Publish", href: "/schedule", icon: Calendar },
    { label: "Listening", href: "/listening", icon: Radio },
  ];

  const currentBrand = brands.find((b) => b.id === activeBrandId) || {
    id: "brand_default",
    name: "Solto Core",
    logoText: "⚡ Solto",
    primaryColor: "#4f46e5",
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Sub-Brand Selector */}
        <div className="flex items-center gap-3">
          <Link href="/inbox" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white hover:opacity-90 transition">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm shadow-sm"
              style={{ backgroundColor: currentBrand.primaryColor || "#4f46e5" }}
            >
              {currentBrand.logoText.slice(0, 2)}
            </div>
            <span className="hidden sm:inline">{currentBrand.name}</span>
            <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Phase 2
            </span>
          </Link>

          {/* Agency Client Switcher */}
          {brands.length > 1 && (
            <div className="relative">
              <select
                value={activeBrandId}
                onChange={(e) => setActiveBrandId(e.target.value)}
                className="text-[11px] bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                title="Switch Client Partition"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Quick Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 transition"
            title="Open Live Chat Widget Simulator"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Chat</span>
          </Link>

          <Link
            href="/pricing"
            className="hidden md:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition"
          >
            <Tag className="w-3 h-3" />
            <span>Pricing</span>
          </Link>

          <Link
            href="/export"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Export all data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
