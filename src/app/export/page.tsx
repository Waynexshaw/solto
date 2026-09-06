"use client";

import { useState, useEffect } from "react";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Database,
  MessageSquare,
  Radio,
  Share2,
} from "lucide-react";

export default function ExportPage() {
  const [stats, setStats] = useState({
    conversations: 0,
    messages: 0,
    channels: 2,
    keywords: 0,
  });
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cRes, kwRes] = await Promise.all([
          fetch("/api/conversations"),
          fetch("/api/listening"),
        ]);
        const cData = await cRes.json();
        const kwData = await kwRes.json();

        setStats({
          conversations: cData.conversations?.length || 0,
          messages: 6, // default demo count
          channels: 2,
          keywords: kwData.keywords?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load export stats:", err);
      }
    };
    loadStats();
  }, []);

  const handleDownload = (format: "json" | "csv") => {
    setDownloadingFormat(format);
    const link = document.createElement("a");
    link.href = `/api/export?format=${format}`;
    link.download = `solto-export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingFormat(null), 1000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Trust & Anti-Lock-In Guarantee</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Sovereign Data Export (Day 1 Feature)
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Unlike enterprise CXM vendors who charge exit fees or gate your data behind complex sales tickets, Solto gives you full, unconstrained ownership of your customer conversations from day one.
        </p>

        {/* Live Data Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Conversations</span>
            </div>
            <div className="text-xl font-bold text-white">{stats.conversations}</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Messages</span>
            </div>
            <div className="text-xl font-bold text-white">{stats.messages}+</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Channels</span>
            </div>
            <div className="text-xl font-bold text-white">{stats.channels} (X & Email)</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Keywords</span>
            </div>
            <div className="text-xl font-bold text-white">{stats.keywords}</div>
          </div>
        </div>
      </div>

      {/* 1-Click Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* JSON Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileJson className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Full JSON Archive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete structured database dump containing users, channels, conversation threads, message timestamps, delivery statuses, and keyword listening metadata.
            </p>
          </div>

          <button
            onClick={() => handleDownload("json")}
            disabled={downloadingFormat === "json"}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingFormat === "json" ? "Generating JSON..." : "Download solto-export.json"}</span>
          </button>
        </div>

        {/* CSV Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tabular CSV Spreadsheet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flattened CSV format suitable for immediate analysis in Excel, Google Sheets, or custom BI dashboards with properly escaped conversation columns.
            </p>
          </div>

          <button
            onClick={() => handleDownload("csv")}
            disabled={downloadingFormat === "csv"}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingFormat === "csv" ? "Generating CSV..." : "Download solto-export.csv"}</span>
          </button>
        </div>
      </div>

      {/* CLI Export Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-base">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <span>Headless CLI Data Export</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          For sysadmins and self-hosters: run exports directly on your server without opening a browser. Perfect for nightly cron backups or data replication pipelines.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 space-y-1">
          <div className="text-slate-500"># Run direct export inside your Solto directory or container:</div>
          <div className="text-emerald-400 font-semibold">$ npm run export</div>
          <div className="text-slate-500 pt-2"># Exports are saved locally to ./exports/ as both JSON and CSV.</div>
        </div>
      </div>
    </div>
  );
}
