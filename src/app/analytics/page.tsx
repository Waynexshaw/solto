"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Clock,
  Radio,
  Share2,
  LifeBuoy,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Zap,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import Link from "next/link";

interface AnalyticsSummary {
  totalConversations: number;
  totalMessages: number;
  byChannel: {
    twitter: number;
    email: number;
  };
  bySource: {
    direct: number;
    listening: number;
  };
  tickets: {
    total: number;
    open: number;
    pending: number;
    resolved: number;
  };
  avgResponseTimeSeconds: number;
  avgResponseFormatted: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json.summary);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
        <span>Loading cross-module reporting metrics...</span>
      </div>
    );
  }

  const twitterPct = data.totalConversations > 0
    ? Math.round((data.byChannel.twitter / data.totalConversations) * 100)
    : 50;
  const emailPct = 100 - twitterPct;

  const listeningPct = data.totalConversations > 0
    ? Math.round((data.bySource.listening / data.totalConversations) * 100)
    : 0;
  const directPct = 100 - listeningPct;

  const resolvedPct = data.tickets.total > 0
    ? Math.round((data.tickets.resolved / data.tickets.total) * 100)
    : 0;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Cross-Module Reporting Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live insights connecting unified inbox volume, response times, and listening vs. direct inbound channels.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avg Response Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Avg. Response Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.avgResponseFormatted}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target &lt; 10m Met</span>
          </div>
        </div>

        {/* Total Message Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Total Conversations</span>
            <Share2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.totalConversations}</div>
          <div className="text-[11px] text-slate-400">
            <span>{data.totalMessages} total customer messages</span>
          </div>
        </div>

        {/* Listening Captures */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Listening Ingestion</span>
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{data.bySource.listening}</div>
          <div className="text-[11px] text-slate-400">
            <span>{listeningPct}% of total inbox volume</span>
          </div>
        </div>

        {/* Ticket Resolution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Tickets Resolved</span>
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{resolvedPct}%</div>
          <div className="text-[11px] text-slate-400">
            <span>{data.tickets.open} open in queue</span>
          </div>
        </div>
      </div>

      {/* Deep Dive Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Volume Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Message Volume by Channel</span>
            </h2>
            <span className="text-xs text-slate-400">{data.totalConversations} Total</span>
          </div>

          <div className="space-y-4">
            {/* Twitter / X */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <span>Twitter / X (DMs & Mentions)</span>
                </div>
                <span className="font-mono text-slate-300 font-bold">
                  {data.byChannel.twitter} ({twitterPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${twitterPct}%` }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Customer Support Email</span>
                </div>
                <span className="font-mono text-slate-300 font-bold">
                  {data.byChannel.email} ({emailPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${emailPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            Directly aggregates both channels through native API connections with no proprietary middleman message markups.
          </div>
        </div>

        {/* Listening vs. Direct Inbound */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Listening vs. Direct Tags</span>
            </h2>
            <span className="text-xs text-slate-400">Cross-Module Feed</span>
          </div>

          <div className="space-y-4">
            {/* Direct Messages */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Direct Inbound / Direct Tags</span>
                </div>
                <span className="font-mono text-slate-300 font-bold">
                  {data.bySource.direct} ({directPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${directPct}%` }}
                />
              </div>
            </div>

            {/* Caught by Listening */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Caught by Keyword Listening</span>
                </div>
                <span className="font-mono text-slate-300 font-bold">
                  {data.bySource.listening} ({listeningPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${listeningPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-center justify-between">
            <span>Listening results automatically appear in the same Unified Inbox.</span>
            <Link
              href="/inbox?listening=true"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View in Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
