"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  Inbox,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";

export default function LiveChatPage() {
  const [visitorName, setVisitorName] = useState("Alexandre Dupont");
  const [visitorEmail, setVisitorEmail] = useState("alexandre@startup.fr");
  const [chatMessage, setChatMessage] = useState("Hi! We want to integrate Solto's live chat into our SaaS portal. Does it support custom SLA routing?");
  const [isSending, setIsSending] = useState(false);
  const [chatSentSuccess, setChatSentSuccess] = useState<any>(null);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !chatMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: visitorName.trim(),
          visitorEmail: visitorEmail.trim() || undefined,
          message: chatMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatSentSuccess(data.conversation);
      }
    } catch (err) {
      console.error("Failed to dispatch live chat message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Customer Service Live Chat Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Live Chat Channel & Widget Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Phase 2 introduces <strong>Live Chat</strong> as a first-class channel alongside Twitter/X and Email. Messages submitted here instantly flow into the <strong>Customer Service Tickets Queue</strong> and <strong>Unified Inbox</strong>.
        </p>
      </div>

      {/* Interactive Chat Widget Simulator Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Embeddable Live Chat Widget</h2>
              <p className="text-xs text-slate-400">Simulating a real customer visiting your website</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Widget Online</span>
          </span>
        </div>

        {chatSentSuccess ? (
          <div className="p-6 rounded-xl bg-slate-950 border border-emerald-800/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Live Chat Message Ingested!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                The conversation has been assigned Ticket ID <code className="text-indigo-300 font-mono">{chatSentSuccess.id}</code> and placed in the high-priority customer service queue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/tickets"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                <LifeBuoy className="w-4 h-4" />
                <span>View in Tickets Queue</span>
              </Link>
              <Link
                href="/inbox"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <Inbox className="w-4 h-4" />
                <span>Open Unified Inbox</span>
              </Link>
              <button
                onClick={() => setChatSentSuccess(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium"
              >
                Send Another Test Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendChat} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Visitor Name</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Visitor Email</label>
                <input
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Chat Inquiry</label>
              <textarea
                rows={3}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !visitorName.trim() || !chatMessage.trim()}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? "Transmitting..." : "Send Live Chat Message to Solto"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
