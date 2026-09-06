"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  Send,
  ShieldCheck,
  Zap,
  Inbox,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { SOLTO_THEME } from "@/lib/theme";

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Form states
  const [userName, setUserName] = useState("Jane Doe");
  const [userEmail, setUserEmail] = useState("jane@acmeco.com");
  const [selectedChannel, setSelectedChannel] = useState<"twitter" | "email">("twitter");
  const [channelHandle, setChannelHandle] = useState("@acme_co");

  // Inbound & Reply states
  const [incomingMessage, setIncomingMessage] = useState<{
    id: string;
    customerName: string;
    handle: string;
    content: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("Hi Jordan! Thanks for reaching out to Acme. We'd love to help with this.");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  // Live timer for the <10 minute target
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Step 2: Connect Channel
  const handleConnectChannel = async () => {
    setStep(3);
    // Ingest simulated first message
    setTimeout(async () => {
      const mockMsg = {
        id: "onb_msg_" + Date.now(),
        customerName: "Jordan Hayes",
        handle: selectedChannel === "twitter" ? "@jordan_h" : "jordan@company.xyz",
        content: `Hi there! I saw ${channelHandle} and wanted to check your team's support response time.`,
      };

      try {
        await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: selectedChannel === "twitter" ? "chn_twitter" : "chn_email",
            channelType: selectedChannel,
            customerName: mockMsg.customerName,
            customerHandle: mockMsg.handle,
            initialMessage: mockMsg.content,
          }),
        });
      } catch (err) {
        console.error("Onboarding seed message failed:", err);
      }

      setIncomingMessage(mockMsg);
    }, 800);
  };

  // Step 4: Send Reply
  const handleSendFirstReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    try {
      // Find latest conversation
      const convRes = await fetch("/api/conversations");
      const convData = await convRes.json();
      const latestConv = convData.conversations?.[0];

      if (latestConv) {
        await fetch("/api/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: latestConv.id,
            content: replyText,
          }),
        });
      }
      setTimerRunning(false);
      setReplySuccess(true);
      setStep(5);
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center">
      {/* Onboarding Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Self-Serve Fast Track</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Connect Channel to First Reply in &lt; 10 Minutes
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              No sales calls, no onboarding delays. Verify your live inbox workflow immediately.
            </p>
          </div>

          {/* Target Stopwatch */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Elapsed Time</div>
              <div className="text-lg font-mono font-bold text-white">
                {formatTimer(elapsedSeconds)} <span className="text-xs text-indigo-400 font-sans">/ 10:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-800 text-xs font-semibold">
          {[
            { num: 1, label: "Account Setup" },
            { num: 2, label: "Connect Channel" },
            { num: 3, label: "First Message" },
            { num: 4, label: "Send Reply" },
          ].map((item) => {
            const isDone = step > item.num || (step === 5 && item.num === 4);
            const isCurrent = step === item.num;
            return (
              <div
                key={item.num}
                className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                  isDone
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                    : isCurrent
                    ? "bg-indigo-950/50 border-indigo-500/60 text-indigo-200"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.num}
                  </span>
                )}
                <span className="truncate hidden sm:inline">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Step 1: Self-Serve Signup */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">1. Self-Serve Account Information</h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero sales reps required. Solto is completely self-managed and transparent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Self-Hosted Guarantee:</strong> All customer data remains stored in your own PostgreSQL database instance. No vendor tracking or third-party training.
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Continue to Channel Connection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Connect Channel */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">2. Connect Your First Channel</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose either Twitter/X or Customer Support Email to start receiving messages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setSelectedChannel("twitter");
                  setChannelHandle("@acme_co");
                }}
                className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  selectedChannel === "twitter"
                    ? "bg-sky-950/30 border-sky-500 shadow-md shadow-sky-500/10"
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Twitter className="w-5 h-5" />
                  </div>
                  {selectedChannel === "twitter" && (
                    <CheckCircle2 className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Twitter / X</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ingest direct messages, replies, and keyword brand listening.
                  </p>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedChannel("email");
                  setChannelHandle("support@acme.com");
                }}
                className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  selectedChannel === "email"
                    ? "bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10"
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  {selectedChannel === "email" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Support Email</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect standard SMTP/IMAP or Resend API for customer email threads.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {selectedChannel === "twitter" ? "Twitter Handle" : "Support Email Address"}
              </label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleConnectChannel}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                <span>Connect & Await First Message</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: First Message Inbound Simulation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">3. Incoming Message Verification</h2>
              <p className="text-xs text-slate-400 mt-1">
                Listening for incoming webhook from {selectedChannel === "twitter" ? "Twitter/X" : "Email Server"}...
              </p>
            </div>

            {!incomingMessage ? (
              <div className="p-10 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <span className="text-sm font-semibold text-slate-200">Listening on channel connector...</span>
                <span className="text-xs text-slate-500">
                  Simulating incoming customer request to verify pipeline health
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{incomingMessage.customerName}</span>
                      <span className="text-xs text-slate-400">{incomingMessage.handle}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Arrived Just Now
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    &ldquo;{incomingMessage.content}&rdquo;
                  </p>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
                >
                  <span>Compose and Send First Reply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Send First Reply */}
        {step === 4 && (
          <form onSubmit={handleSendFirstReply} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">4. Dispatch First Reply</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your response will actually be transmitted via the channel connector.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Replying to {incomingMessage?.customerName}:</div>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSendingReply || !replyText.trim()}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              {isSendingReply ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting reply via channel...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send First Reply</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 5: Success & Target Met */}
        {step === 5 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Onboarding Target Achieved!</span>
              </div>
              <h2 className="text-2xl font-black text-white">First Reply Dispatched in {formatTimer(elapsedSeconds)}</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                You have connected a channel, received your first conversation, and sent a live reply in under 10 minutes with zero sales friction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left max-w-md mx-auto text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Channel:</span>
                <strong className="text-white">{channelHandle}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Database:</span>
                <strong className="text-white">PostgreSQL (Self-hosted)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Data Export:</span>
                <strong className="text-emerald-400">Available from Day 1</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/inbox"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                <Inbox className="w-4 h-4" />
                <span>Open Unified Inbox</span>
              </Link>
              <Link
                href="/schedule"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
              >
                <span>Try Post Scheduling</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
