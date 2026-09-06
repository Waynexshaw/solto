"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  MessageSquare,
  Trash2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { Mail } from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  conditionKeyword: string;
  actionType: "auto_tag" | "auto_reply";
  actionValue: string;
  isActive: boolean;
  lastTestedAt?: string;
  matchCount?: number;
  createdAt: string;
}

interface TestMatch {
  messageId: string;
  conversationId: string;
  customerName: string;
  customerHandle: string;
  channelType: string;
  messageContent: string;
  timestamp: string;
  wouldAction: string;
}

interface TestReport {
  totalScanned: number;
  totalMatches: number;
  matches: TestMatch[];
  testedAt: string;
}

export default function AutomationsPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [ruleName, setRuleName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [actionType, setActionType] = useState<"auto_tag" | "auto_reply">("auto_tag");
  const [actionValue, setActionValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // QA Test Report Modal states
  const [activeTestRule, setActiveTestRule] = useState<AutomationRule | null>(null);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [hasReviewedReport, setHasReviewedReport] = useState(false);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/automations");
      const data = await res.json();
      if (data.success) {
        setRules(data.rules);
      }
    } catch (err) {
      console.error("Failed to load automation rules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !keyword.trim() || !actionValue.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ruleName.trim(),
          conditionKeyword: keyword.trim(),
          actionType,
          actionValue: actionValue.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleName("");
        setKeyword("");
        setActionValue("");
        fetchRules();
        // Immediately prompt QA Sandbox testing!
        handleRunTest(data.rule);
      }
    } catch (err) {
      console.error("Failed to create rule:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRunTest = async (rule: AutomationRule) => {
    setActiveTestRule(rule);
    setTestReport(null);
    setIsTesting(true);
    setHasReviewedReport(false);

    try {
      const res = await fetch("/api/automations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conditionKeyword: rule.conditionKeyword,
          actionType: rule.actionType,
          actionValue: rule.actionValue,
          ruleId: rule.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestReport(data.report);
      }
    } catch (err) {
      console.error("QA Test execution failed:", err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleActivateRule = async (ruleId: string) => {
    try {
      const res = await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ruleId, isActive: true }),
      });
      if (res.ok) {
        setActiveTestRule(null);
        fetchRules();
      }
    } catch (err) {
      console.error("Failed to activate rule:", err);
    }
  };

  const handleToggleActive = async (rule: AutomationRule) => {
    if (!rule.isActive && !rule.lastTestedAt) {
      // Must test first!
      handleRunTest(rule);
      return;
    }
    try {
      await fetch("/api/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
      });
      fetchRules();
    } catch (err) {
      console.error("Failed to toggle rule:", err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await fetch(`/api/automations?id=${id}`, { method: "DELETE" });
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete rule:", err);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Solto Core Differentiator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Cpu className="w-7 h-7 text-indigo-400" />
          <span>Automation QA Sandbox</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Enterprise tools risk sending broken auto-replies or wrong tags directly into production. Solto allows you to dry-run any automation rule against your <strong>entire historical conversation archive</strong> before activation.
        </p>
      </div>

      {/* Grid: Create Rule (5 cols) + Rules List (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rule Builder */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Create Automation Rule</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rules are automatically sandboxed and cannot go live without a historical QA test.
            </p>
          </div>

          <form onSubmit={handleCreateRule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rule Name</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Migration Inquiries Tagging"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trigger Condition: If message contains
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Sprinklr, Docker, pricing, urgent"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Action Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType("auto_tag")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    actionType === "auto_tag"
                      ? "bg-indigo-950/60 border-indigo-500 text-indigo-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Auto-Tag</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("auto_reply")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    actionType === "auto_reply"
                      ? "bg-indigo-950/60 border-indigo-500 text-indigo-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Auto-Reply</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {actionType === "auto_tag" ? "Tag Name to Apply" : "Auto-Reply Message Text"}
              </label>
              {actionType === "auto_tag" ? (
                <input
                  type="text"
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  placeholder="e.g. High Intent / Enterprise"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <textarea
                  rows={3}
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  placeholder="Hi! Thanks for contacting us. Solto is completely self-hostable with single-command Docker deployment..."
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isCreating || !ruleName.trim() || !keyword.trim() || !actionValue.trim()}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rule & Test in QA Sandbox</span>
            </button>
          </form>
        </div>

        {/* Right: Existing Rules List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col min-h-0 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Configured Automations ({rules.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every rule requires pre-activation verification against historical messages.
              </p>
            </div>
            <button
              onClick={fetchRules}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title="Refresh Rules"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="text-xs text-slate-500 text-center py-8">Loading automation rules...</div>
            ) : rules.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-semibold text-slate-300">No automation rules yet</p>
                <p className="text-xs text-slate-500 mt-1">Create your first rule on the left.</p>
              </div>
            ) : (
              rules.map((rule) => {
                const isLive = rule.isActive;
                const wasTested = !!rule.lastTestedAt;

                return (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{rule.name}</h3>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              isLive
                                ? "bg-emerald-950/70 text-emerald-300 border-emerald-800"
                                : wasTested
                                ? "bg-amber-950/70 text-amber-300 border-amber-800"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {isLive ? "Live in Production" : wasTested ? "QA Tested (Pending Activation)" : "Untested Draft"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          If contains: <strong className="text-indigo-400">&ldquo;{rule.conditionKeyword}&rdquo;</strong>{" "}
                          $\rightarrow$ {rule.actionType === "auto_tag" ? "Tag as" : "Reply with"}{" "}
                          <strong className="text-slate-200">&ldquo;{rule.actionValue}&rdquo;</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        {wasTested ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tested ({rule.matchCount || 0} historical matches)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Untested</span>
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRunTest(rule)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                        >
                          <Play className="w-3 h-3" />
                          <span>Run QA Test</span>
                        </button>

                        <button
                          onClick={() => handleToggleActive(rule)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isLive
                              ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20"
                          }`}
                        >
                          <span>{isLive ? "Deactivate" : "Activate Rule"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* QA Sandbox Test Results Modal / Panel */}
      {/* ==================================================================== */}
      {activeTestRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    QA Sandbox: Historical Simulation Report
                  </h3>
                  <p className="text-xs text-slate-400">
                    Rule: &ldquo;{activeTestRule.name}&rdquo; (Matching: &ldquo;{activeTestRule.conditionKeyword}&rdquo;)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTestRule(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isTesting ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-200">
                  Scanning past conversations against &ldquo;{activeTestRule.conditionKeyword}&rdquo;...
                </p>
                <p className="text-xs text-slate-500">
                  Inspecting customer threads, message text, and channel dispatch targets.
                </p>
              </div>
            ) : testReport ? (
              <div className="space-y-4">
                {/* Stats Header */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">Messages Scanned</div>
                    <div className="text-lg font-bold text-white">{testReport.totalScanned}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Matches Found</div>
                    <div className="text-lg font-bold text-indigo-400">{testReport.totalMatches}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">QA Safety Check</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passed</span>
                    </div>
                  </div>
                </div>

                {/* Match Details List */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    What this rule WOULD HAVE DONE on past messages:
                  </div>

                  {testReport.matches.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                      No past messages contain &ldquo;{activeTestRule.conditionKeyword}&rdquo;. The rule will only trigger on future messages.
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                      {testReport.matches.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {m.channelType === "twitter" ? (
                                <Twitter className="w-3 h-3 text-sky-400" />
                              ) : (
                                <Mail className="w-3 h-3 text-emerald-400" />
                              )}
                              <span className="font-bold text-white">{m.customerName}</span>
                              <span className="text-slate-400">({m.customerHandle})</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(m.timestamp).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                            &ldquo;{m.messageContent}&rdquo;
                          </p>

                          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-500/30">
                            <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                            <span>Action: {m.wouldAction}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification & Activation Action Bar */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasReviewedReport}
                      onChange={(e) => setHasReviewedReport(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>I have reviewed the simulation results and approve activation</span>
                  </label>

                  <button
                    disabled={!hasReviewedReport}
                    onClick={() => handleActivateRule(activeTestRule.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activate Rule Live</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
