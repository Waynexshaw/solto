"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  TrendingUp,
  Clock,
  Eye,
  MousePointerClick,
  Play,
  Pause,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { Mail } from "lucide-react";

interface PaidCampaign {
  id: string;
  brandId: string;
  name: string;
  budget: number;
  spend: number;
  targetChannel: "twitter" | "email" | "all";
  durationDays: number;
  startDate: string;
  endDate: string;
  headline: string;
  creativeUrl?: string;
  status: "draft" | "active" | "paused" | "completed";
  impressions: number;
  clicks: number;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<PaidCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("1500");
  const [targetChannel, setTargetChannel] = useState<"twitter" | "email" | "all">("twitter");
  const [durationDays, setDurationDays] = useState("30");
  const [headline, setHeadline] = useState("");
  const [creativeUrl, setCreativeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !budget || !headline.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          budget: Number(budget),
          targetChannel,
          durationDays: Number(durationDays),
          headline: headline.trim(),
          creativeUrl: creativeUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setName("");
        setHeadline("");
        setCreativeUrl("");
        fetchCampaigns();
      }
    } catch (err) {
      console.error("Failed to create campaign:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  // Aggregated totals
  const totalBudget = campaigns.reduce((acc, c) => acc + Number(c.budget || 0), 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + Number(c.spend || 0), 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + Number(c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + Number(c.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Paid / Ads Campaign Planning</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            First-class paid post & ad planning built directly into Solto. Budget allocation, duration tracking, and creative assets separate from organic scheduling.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Paid Campaign</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Ad Budget</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">${totalBudget.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Allocated across {campaigns.length} campaigns</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Spend to Date</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${totalSpend.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">
            {totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0}% of budget spent
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Paid Impressions</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">{totalImpressions.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Verified paid reach</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Clicks & CTR</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalClicks.toLocaleString()}{" "}
            <span className="text-sm font-semibold text-amber-400 font-mono">({avgCtr}%)</span>
          </div>
          <div className="text-[11px] text-slate-500">Cost-per-click tracking enabled</div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Active & Planned Campaigns ({campaigns.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="text-xs text-slate-500 text-center py-16">Loading paid campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <DollarSign className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No paid campaigns created yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click &ldquo;New Paid Campaign&rdquo; above to set up your first promoted campaign.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => {
              const isTwitter = camp.targetChannel === "twitter";
              const percentSpent = camp.budget > 0 ? Math.min(100, Math.round((camp.spend / camp.budget) * 100)) : 0;
              const isActive = camp.status === "active";

              return (
                <div
                  key={camp.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                          {isTwitter ? (
                            <>
                              <Twitter className="w-3 h-3 text-sky-400" />
                              <span>Twitter Promoted Ad</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-emerald-400" />
                              <span>Email Sponsored Blast</span>
                            </>
                          )}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{camp.name}</h3>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border ${
                          isActive
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-800"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    {/* Creative preview if exists */}
                    {camp.creativeUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 max-h-36 relative bg-slate-950">
                        <img src={camp.creativeUrl} alt="Ad creative" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed line-clamp-2">
                      &ldquo;{camp.headline}&rdquo;
                    </p>

                    {/* Budget & Spend Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Budget Spent</span>
                        <span className="font-mono text-slate-200 font-bold">
                          ${camp.spend.toLocaleString()} / ${camp.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                    </div>

                    {/* Impressions / Clicks */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Impressions</span>
                        <span className="font-bold text-white">{camp.impressions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Clicks</span>
                        <span className="font-bold text-white">{camp.clicks.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{camp.durationDays} days duration</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(camp.id, camp.status)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
                          isActive
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                        }`}
                      >
                        {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isActive ? "Pause" : "Resume"}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Create First-Class Paid Campaign</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Migration Blitz"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Channel</label>
                  <select
                    value={targetChannel}
                    onChange={(e) => setTargetChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="twitter">Twitter / X Promoted</option>
                    <option value="email">Email Sponsored Broadcast</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Headline & Message Copy</label>
                <textarea
                  rows={3}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Stop paying enterprise bloat. Solto gives you full customer inbox sovereignty..."
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Linked Creative URL (Image asset)</span>
                </label>
                <input
                  type="url"
                  value={creativeUrl}
                  onChange={(e) => setCreativeUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !headline.trim()}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                >
                  <span>Launch Paid Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
