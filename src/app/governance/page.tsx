"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  XCircle,
  FileCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { Mail } from "lucide-react";

interface ApprovalItem {
  id: string;
  type: "reply" | "post";
  targetChannel: string;
  authorName: string;
  recipientOrChannel: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  feedbackNote?: string;
  createdAt: string;
}

interface GovernanceConfig {
  approvalRequired: boolean;
  complianceWords: string[];
}

export default function GovernancePage() {
  const [config, setConfig] = useState<GovernanceConfig>({
    approvalRequired: false,
    complianceWords: [],
  });
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [newComplianceWord, setNewComplianceWord] = useState("");
  const [testMessage, setTestMessage] = useState("We provide an unconditional warranty and 100% refund guaranteed.");
  const [complianceFeedback, setComplianceFeedback] = useState<{ isCompliant: boolean; flaggedWords: string[] } | null>(null);

  const fetchGovernance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/governance");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setApprovals(data.approvals);
      }
    } catch (err) {
      console.error("Failed to load governance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernance();
  }, []);

  // Real-time compliance scanner
  useEffect(() => {
    if (!testMessage.trim()) {
      setComplianceFeedback(null);
      return;
    }
    const check = async () => {
      try {
        const res = await fetch("/api/governance/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: testMessage }),
        });
        const data = await res.json();
        if (data.success) {
          setComplianceFeedback({
            isCompliant: data.isCompliant,
            flaggedWords: data.flaggedWords,
          });
        }
      } catch (err) {
        console.error("Compliance check failed:", err);
      }
    };
    check();
  }, [testMessage, config.complianceWords]);

  const handleToggleApprovalSetting = async () => {
    const nextVal = !config.approvalRequired;
    try {
      const res = await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalRequired: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (err) {
      console.error("Failed to toggle approval setting:", err);
    }
  };

  const handleAddComplianceWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplianceWord.trim()) return;

    const updatedWords = [...config.complianceWords, newComplianceWord.trim().toLowerCase()];
    try {
      const res = await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complianceWords: updatedWords }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setNewComplianceWord("");
      }
    } catch (err) {
      console.error("Failed to add word:", err);
    }
  };

  const handleDeleteComplianceWord = async (wordToDelete: string) => {
    const updatedWords = config.complianceWords.filter((w) => w !== wordToDelete);
    try {
      const res = await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complianceWords: updatedWords }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (err) {
      console.error("Failed to delete word:", err);
    }
  };

  const handleReviewApproval = async (id: string, action: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/governance/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        fetchGovernance();
      }
    } catch (err) {
      console.error("Failed to review approval:", err);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <span>Governance & Compliance Controls</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mid-market and agency governance tooling: optional two-person approval workflows and real-time pre-send compliance keyword flagging.
          </p>
        </div>

        {/* Global Approval Toggle */}
        <div
          onClick={handleToggleApprovalSetting}
          className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition self-start sm:self-auto"
        >
          <div className="text-right">
            <div className="text-xs font-bold text-white">Two-Person Approval</div>
            <div className="text-[10px] text-slate-400">
              {config.approvalRequired ? "Mandatory for all outbound" : "Disabled (Direct Send)"}
            </div>
          </div>
          {config.approvalRequired ? (
            <ToggleRight className="w-8 h-8 text-emerald-400" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-slate-600" />
          )}
        </div>
      </div>

      {/* Grid: Approvals Queue (7 cols) + Compliance Word Flags (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Approvals Queue */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 flex flex-col min-h-0">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Outbound Review Queue ({pendingApprovals.length} Pending)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Messages routed to a second user for review before being dispatched live to channels.
              </p>
            </div>
            <button onClick={fetchGovernance} className="p-1 rounded-md text-slate-400 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">All outbound messages approved</p>
                <p className="text-xs text-slate-500 mt-1">
                  No messages currently awaiting review in the approval queue.
                </p>
              </div>
            ) : (
              pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.authorName}</span>
                      <span className="text-[11px] text-slate-400">
                        routing reply to <strong className="text-slate-200">{item.recipientOrChannel}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                      Awaiting Sign-off
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-900/70 p-3 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-wrap">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  {item.feedbackNote && (
                    <div className="text-[11px] text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.feedbackNote}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <span className="text-[10px] text-slate-500">
                      Submitted {new Date(item.createdAt).toLocaleTimeString()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReviewApproval(item.id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleReviewApproval(item.id, "approved")}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm shadow-emerald-600/30 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Compliance Keyword Flagging & Live Test Scanner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Restricted Words Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Restricted Compliance Phrases</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Outbound replies containing any of these words trigger an automatic warning banner.
              </p>
            </div>

            {/* Add phrase input */}
            <form onSubmit={handleAddComplianceWord} className="flex gap-2">
              <input
                type="text"
                value={newComplianceWord}
                onChange={(e) => setNewComplianceWord(e.target.value)}
                placeholder="e.g. 100% refund, guaranteed"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newComplianceWord.trim()}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Word Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {config.complianceWords.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{word}</span>
                  <button
                    onClick={() => handleDeleteComplianceWord(word)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Real-time Pre-Send Scanner Test Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Interactive Compliance Scanner Test</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Test how the compliance engine scans replies before dispatch.
              </p>
            </div>

            <textarea
              rows={3}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />

            {complianceFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                  complianceFeedback.isCompliant
                    ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                    : "bg-rose-950/70 border-rose-800 text-rose-200"
                }`}
              >
                {complianceFeedback.isCompliant ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Compliance Verified:</strong>
                      No restricted words found. Safe to dispatch.
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-100 block">Compliance Warning Triggered:</strong>
                      Found restricted phrases:{" "}
                      <strong className="text-amber-300">
                        {complianceFeedback.flaggedWords.join(", ")}
                      </strong>
                      . Dispatch will require supervisor sign-off.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
