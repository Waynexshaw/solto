"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Inbox,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { SOLTO_THEME } from "@/lib/theme";

interface Keyword {
  id: string;
  keyword: string;
  channel: "twitter" | "email" | "all";
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  customerName: string;
  customerHandle: string;
  snippet: string;
  isListeningCaught: boolean;
  listeningKeyword?: string;
  lastMessageAt: string;
}

export default function ListeningPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [caughtConversations, setCaughtConversations] = useState<Conversation[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [newChannel, setNewChannel] = useState<"all" | "twitter" | "email">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState<string | null>(null);

  const fetchKeywords = async () => {
    setIsLoading(true);
    try {
      const [kwRes, convRes] = await Promise.all([
        fetch("/api/listening"),
        fetch("/api/conversations?listening=true"),
      ]);
      const kwData = await kwRes.json();
      const convData = await convRes.json();

      if (kwData.success) setKeywords(kwData.keywords);
      if (convData.success) setCaughtConversations(convData.conversations);
    } catch (err) {
      console.error("Failed to load listening data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    try {
      const res = await fetch("/api/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword.trim(), channel: newChannel }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyword("");
        fetchKeywords();
      }
    } catch (err) {
      console.error("Failed to add keyword:", err);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      const res = await fetch(`/api/listening?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setKeywords((prev) => prev.filter((k) => k.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete keyword:", err);
    }
  };

  const handleRunScan = async () => {
    setIsPolling(true);
    setPollStatus(null);
    try {
      const res = await fetch("/api/listening/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setPollStatus(data.message || `Scanned public posts. Found ${data.addedCount} matches!`);
        fetchKeywords();
      }
    } catch (err: any) {
      setPollStatus("Error running scan: " + err.message);
    } finally {
      setIsPolling(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-500" />
            <span>Social & Brand Keyword Listening</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Track mentions of your brand name, competitors, or topics even when your account is not directly tagged. Matching posts are automatically flagged in the Unified Inbox.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isPolling}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? "animate-spin" : ""}`} />
          <span>{isPolling ? "Scanning Public Posts..." : "Run Listening Scan Now"}</span>
        </button>
      </div>

      {pollStatus && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{pollStatus}</span>
        </div>
      )}

      {/* Grid: Keyword Configuration (5 Cols) + Caught Mentions Feed (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tracked Keywords Manager */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Tracked Keywords</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add brand names, hashtags, or competitor keywords to listen for.
            </p>
          </div>

          {/* Add Keyword Form */}
          <form onSubmit={handleAddKeyword} className="space-y-3">
            <div>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="e.g. Solto, @solto_hq, #CXM"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Channels</option>
                <option value="twitter">Twitter / X</option>
                <option value="email">Email</option>
              </select>

              <button
                type="submit"
                disabled={!newKeyword.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Track Keyword</span>
              </button>
            </div>
          </form>

          {/* Keywords List */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="text-xs font-semibold text-slate-400 mb-2">Active Trackers ({keywords.length})</div>
            {isLoading ? (
              <div className="text-xs text-slate-500 text-center py-4">Loading keywords...</div>
            ) : keywords.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">No keywords tracked yet.</div>
            ) : (
              keywords.map((kw) => (
                <div
                  key={kw.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-white">{kw.keyword}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {kw.channel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{kw.matchCount} matches</span>
                    <button
                      onClick={() => handleDeleteKeyword(kw.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Delete keyword"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Posts Caught by Listening */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" />
                <span>Posts Caught By Listening ({caughtConversations.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Surfaced public posts tagged with visual badge &ldquo;caught by listening&rdquo;.
              </p>
            </div>

            <Link
              href="/inbox"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              <span>View in Unified Inbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {caughtConversations.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Radio className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No listening captures yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click &ldquo;Run Listening Scan Now&rdquo; above to search public channels for matching posts.
                </p>
              </div>
            ) : (
              caughtConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                        <Twitter className="w-3 h-3" />
                      </span>
                      <span className="text-xs font-bold text-white">{conv.customerName}</span>
                      <span className="text-xs text-slate-400">{conv.customerHandle}</span>
                    </div>

                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold border"
                      style={{
                        backgroundColor: SOLTO_THEME.colors.listeningBadgeBg,
                        color: SOLTO_THEME.colors.listeningBadgeText,
                        borderColor: SOLTO_THEME.colors.listeningBadgeBorder,
                      }}
                    >
                      <Radio className="w-3 h-3" />
                      Caught by listening {conv.listeningKeyword && `(#${conv.listeningKeyword})`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    &ldquo;{conv.snippet}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      Captured {new Date(conv.lastMessageAt).toLocaleString()}
                    </span>

                    <Link
                      href="/inbox"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <span>Open Thread & Reply</span>
                      <ExternalLink className="w-3 h-3" />
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
