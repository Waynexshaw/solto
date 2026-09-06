"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Radio,
  Send,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Inbox,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { SOLTO_THEME } from "@/lib/theme";

interface Conversation {
  id: string;
  channelId: string;
  channelType: "twitter" | "email" | "livechat";
  customerName: string;
  customerHandle: string;
  customerAvatar?: string;
  snippet: string;
  unread: boolean;
  isListeningCaught: boolean;
  listeningKeyword?: string;
  ticketStatus?: "open" | "pending" | "resolved";
  priority?: "low" | "medium" | "high";
  lastMessageAt: string;
  createdAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderType: "customer" | "agent";
  senderName: string;
  senderHandle: string;
  content: string;
  status: string;
  channelMessageId?: string;
  createdAt: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [channelFilter, setChannelFilter] = useState<"all" | "twitter" | "email" | "livechat">("all");
  const [filterType, setFilterType] = useState<"all" | "unread" | "listening">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [complianceWarning, setComplianceWarning] = useState<string[] | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendResultNote, setSendResultNote] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  const fetchConversations = async () => {
    setIsLoadingList(true);
    try {
      const params = new URLSearchParams();
      if (channelFilter !== "all") params.set("channel", channelFilter);
      if (filterType === "unread") params.set("unread", "true");
      if (filterType === "listening") params.set("listening", "true");

      const res = await fetch(`/api/conversations?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        if (!activeConvId && data.conversations.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [channelFilter, filterType]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const loadThread = async () => {
      setIsLoadingMessages(true);
      setSendResultNote(null);
      try {
        const res = await fetch(`/api/conversations/${activeConvId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          // Mark read
          await fetch(`/api/conversations/${activeConvId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markRead: true }),
          });
          // Update unread state locally
          setConversations((prev) =>
            prev.map((c) => (c.id === activeConvId ? { ...c, unread: false } : c))
          );
        }
      } catch (err) {
        console.error("Failed to load thread messages:", err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadThread();
  }, [activeConvId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Phase 2: Live Governance & Compliance Scanner
  useEffect(() => {
    if (!replyText.trim()) {
      setComplianceWarning(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/governance/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyText }),
        });
        const data = await res.json();
        if (data.success && !data.isCompliant) {
          setComplianceWarning(data.flaggedWords);
        } else {
          setComplianceWarning(null);
        }
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [replyText]);

  // Handle reply submission
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId || isSending) return;

    setIsSending(true);
    setSendResultNote(null);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setReplyText("");
        setSendResultNote(
          data.dispatch?.note || `Sent via ${data.dispatch?.provider || "Channel API"}`
        );
        // Refresh conversation preview
        fetchConversations();
      } else {
        alert("Failed to send message: " + data.error);
      }
    } catch (err: any) {
      alert("Error sending message: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Filtered list by search query
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.customerName.toLowerCase().includes(q) ||
      c.customerHandle.toLowerCase().includes(q) ||
      c.snippet.toLowerCase().includes(q)
    );
  });

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-7xl w-full mx-auto p-4 sm:p-6 gap-4">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Unified Inbox</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-normal">
              {conversations.length} total
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single view for direct messages, emails, and keyword-listening captures.
          </p>
        </div>

        {/* Filter Pill Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Channel Filters */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setChannelFilter("all")}
              className={`px-3 py-1 rounded-md transition ${
                channelFilter === "all" ? "bg-indigo-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              All Channels
            </button>
            <button
              onClick={() => setChannelFilter("twitter")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                channelFilter === "twitter" ? "bg-sky-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              Twitter/X
            </button>
            <button
              onClick={() => setChannelFilter("email")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                channelFilter === "email" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
            <button
              onClick={() => setChannelFilter("livechat")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                channelFilter === "livechat" ? "bg-emerald-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Live Chat
            </button>
          </div>

          {/* Type Filters */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-md transition ${
                filterType === "all" ? "bg-slate-800 text-slate-200 font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("unread")}
              className={`px-3 py-1 rounded-md transition ${
                filterType === "unread" ? "bg-indigo-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterType("listening")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                filterType === "listening" ? "bg-amber-600 text-white font-medium" : "text-slate-400 hover:text-white"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Listening
            </button>
          </div>

          <button
            onClick={fetchConversations}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Refresh Inbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Inbox Window */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Left Column: Conversations List (5 Cols) */}
        <div className="md:col-span-5 flex flex-col border-r border-slate-800 bg-slate-900/50 min-h-0">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {isLoadingList ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">No conversations found</p>
                <p className="text-xs text-slate-500 mt-1">
                  {filterType === "listening"
                    ? "No mentions caught yet. Try running keyword scan in Listening tab."
                    : "Try adjusting filters or sending a test message."}
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeConvId;
                const isTwitter = c.channelType === "twitter";

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-3.5 cursor-pointer transition flex gap-3 relative ${
                      isSelected
                        ? "bg-slate-800/90 border-l-4 border-indigo-500"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Customer Avatar & Channel Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-200 overflow-hidden border border-slate-600">
                        {c.customerAvatar ? (
                          <img src={c.customerAvatar} alt={c.customerName} className="w-full h-full object-cover" />
                        ) : (
                          c.customerName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white ${
                          c.channelType === "twitter"
                            ? "bg-sky-500"
                            : c.channelType === "livechat"
                            ? "bg-emerald-600"
                            : "bg-emerald-500"
                        }`}
                      >
                        {c.channelType === "twitter" ? (
                          <Twitter className="w-2.5 h-2.5" />
                        ) : c.channelType === "livechat" ? (
                          <MessageCircle className="w-2.5 h-2.5" />
                        ) : (
                          <Mail className="w-2.5 h-2.5" />
                        )}
                      </span>
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-sm truncate ${c.unread ? "font-bold text-white" : "font-medium text-slate-200"}`}>
                            {c.customerName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">{c.customerHandle}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {formatTime(c.lastMessageAt)}
                        </span>
                      </div>

                      <p className={`text-xs truncate ${c.unread ? "text-slate-200 font-medium" : "text-slate-400"}`}>
                        {c.snippet}
                      </p>

                      {/* Badges: Unread & Caught By Listening */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {c.isListeningCaught && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
                            style={{
                              backgroundColor: SOLTO_THEME.colors.listeningBadgeBg,
                              color: SOLTO_THEME.colors.listeningBadgeText,
                              borderColor: SOLTO_THEME.colors.listeningBadgeBorder,
                            }}
                          >
                            <Radio className="w-2.5 h-2.5" />
                            Caught by listening {c.listeningKeyword && `(#${c.listeningKeyword})`}
                          </span>
                        )}

                        {c.unread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 ml-auto flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Conversation Thread (7 Cols) */}
        <div className="md:col-span-7 flex flex-col bg-slate-950 min-h-0">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-200 overflow-hidden border border-slate-700">
                    {activeConv.customerAvatar ? (
                      <img src={activeConv.customerAvatar} alt={activeConv.customerName} className="w-full h-full object-cover" />
                    ) : (
                      activeConv.customerName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white">{activeConv.customerName}</h2>
                      <span className="text-xs text-slate-400">{activeConv.customerHandle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        {activeConv.channelType === "twitter" ? (
                          <>
                            <Twitter className="w-3 h-3 text-sky-400" />
                            <span>Twitter / X DM & Mentions</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-emerald-400" />
                            <span>Email Support</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Ticket Status Selector */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">Ticket:</span>
                    <select
                      value={activeConv.ticketStatus || "open"}
                      onChange={async (e) => {
                        const newStatus = e.target.value as any;
                        await fetch("/api/tickets", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: activeConv.id, status: newStatus }),
                        });
                        setConversations((prev) =>
                          prev.map((c) => (c.id === activeConv.id ? { ...c, ticketStatus: newStatus } : c))
                        );
                      }}
                      className="bg-transparent text-xs font-semibold focus:outline-none text-slate-200"
                    >
                      <option value="open" className="bg-slate-900 text-indigo-400">Open</option>
                      <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                      <option value="resolved" className="bg-slate-900 text-emerald-400">Resolved</option>
                    </select>
                  </div>

                  {/* Listening Alert Badge in Header if applicable */}
                  {activeConv.isListeningCaught && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                      style={{
                        backgroundColor: SOLTO_THEME.colors.listeningBadgeBg,
                        color: SOLTO_THEME.colors.listeningBadgeText,
                        borderColor: SOLTO_THEME.colors.listeningBadgeBorder,
                      }}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Matched: #{activeConv.listeningKeyword}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Thread Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="text-center text-xs text-slate-400 py-10">Loading message thread...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-10">No messages in this conversation.</div>
                ) : (
                  messages.map((m) => {
                    const isAgent = m.senderType === "agent";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">{m.senderName}</span>
                          <span>{m.senderHandle}</span>
                          <span>•</span>
                          <span>{formatTime(m.createdAt)}</span>
                        </div>

                        <div
                          className={`max-w-xl rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                            isAgent
                              ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                              : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700"
                          }`}
                        >
                          {m.content}
                        </div>

                        {/* Delivery Status Indicator */}
                        {isAgent && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{m.status === "delivered" ? "Delivered via channel" : m.status}</span>
                            {m.channelMessageId && (
                              <span className="font-mono text-[9px] text-slate-600">({m.channelMessageId})</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Live Dispatch Notification */}
              {sendResultNote && (
                <div className="mx-4 my-1 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{sendResultNote}</span>
                </div>
              )}

              {/* Reply Box */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                <form onSubmit={handleSendReply} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Send className="w-3 h-3 text-indigo-400" />
                      <span>
                        Replying via{" "}
                        <strong className="text-white">
                          {activeConv.channelType === "twitter" ? "@solto_hq (Twitter/X)" : "support@solto.io (Email)"}
                        </strong>
                      </span>
                    </span>

                    {/* Quick Template Fillers */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyText(
                            activeConv.channelType === "twitter"
                              ? "Thanks for reaching out! Solto is self-hostable with single-command Docker deployment. Full data sovereignty guaranteed."
                              : "Hello! Thank you for contacting Solto. We are built specifically for teams seeking a straightforward, self-hostable customer inbox with full export capability."
                          )
                        }
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                      >
                        + Insert Quick Answer
                      </button>
                    </div>
                  </div>

                  {complianceWarning && (
                    <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Governance Alert:</strong> Restricted phrase detected:{" "}
                        <strong className="text-amber-300">{complianceWarning.join(", ")}</strong>. Please revise before sending.
                      </span>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        activeConv.channelType === "twitter"
                          ? `Send a reply to ${activeConv.customerHandle} (actual tweet/DM)...`
                          : `Write an email response to ${activeConv.customerHandle}...`
                      }
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Dispatches directly via channel API with automated retry and delivery receipts.
                    </span>

                    <button
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Inbox className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-base font-semibold text-slate-300">Select a conversation</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose an item from the left to inspect customer messages and dispatch replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
