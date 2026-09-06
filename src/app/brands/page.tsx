"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  primaryColor: string;
  isDefault: boolean;
  createdAt: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [logoText, setLogoText] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logoText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          logoText: logoText.trim(),
          primaryColor,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setLogoText("");
        setPrimaryColor("#4f46e5");
        fetchBrands();
      }
    } catch (err) {
      console.error("Failed to create brand:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>White-Label & Multi-Brand Support</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Designed for agencies and multi-brand enterprises. Manage multiple clients or sub-brands under one login with isolated channels, tickets, and custom branding without data mixing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Data Contamination</span>
        </div>
      </div>

      {/* Grid: Create Sub-Brand (5 cols) + Brands Overview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Create Brand Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Sub-Brand / Client</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each brand gets partitioned channels, conversation threads, and custom UI styling.
            </p>
          </div>

          <form onSubmit={handleCreateBrand} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Client Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Media Agency"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Text / Symbol</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="e.g. ⚡ Apex"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-800 p-1"
                />
                <span className="font-mono text-xs text-slate-300 uppercase">{primaryColor}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Optional by Default:</strong> Single-brand SMB accounts can simply use the primary brand without configuring multi-brand partitions.
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !logoText.trim()}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sub-Brand Partition</span>
            </button>
          </form>
        </div>

        {/* Right: Sub-Brands List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 flex flex-col min-h-0">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Configured Sub-Brands ({brands.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between clients seamlessly from the brand selector.
              </p>
            </div>

            <button onClick={fetchBrands} className="p-1 rounded-md text-slate-400 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="text-xs text-slate-500 text-center py-12">Loading brands...</div>
            ) : brands.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No sub-brands configured.</div>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.logoText.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{brand.name}</h3>
                        {brand.isDefault && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Primary Account
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Slug: <code className="text-slate-300">{brand.slug}</code></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: brand.primaryColor }}
                          />
                          <span>{brand.primaryColor}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/inbox?brandId=${brand.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      <span>Open Brand Inbox</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
