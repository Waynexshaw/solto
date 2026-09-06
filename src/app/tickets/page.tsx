"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Mail,
  Tag,
  ArrowUpDown,
  MessageCircle,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";

interface Ticket {
  id: string;
  channelId: string;
  channelType: "twitter" | "email" | "livechat";
  customerName: string;
  customerHandle: string;
  customerAvatar?: string;
  snippet: string;
  unread: boolean;
  isTicket: boolean;
  ticketStatus: "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high";
  tags?: string[];
  lastMessageAt: string;
  createdAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<"open" | "pending" | "resolved" | "all">("open");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const handleUpdateStatus = async (ticketId: string, newStatus: "open" | "pending" | "resolved") => {
    try {
      const res = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status: newStatus }),
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
    }
  };

  const calculateAge = (isoString: string) => {
    const ms = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(ms / (1000 * 60));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            <span>Customer Service Tickets Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Unified cross-channel queue <strong>sorted by oldest first by default</strong> to ensure customer SLAs and response commitments are never missed.
          </p>
        </div>

        {/* Priority / Sort indicator */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sorted: <strong>Oldest First (Default)</strong></span>
        </div>
      </div>

      {/* Filter and Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter("open")}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === "open"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Open Tickets
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === "pending"
                  ? "bg-amber-600 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === "resolved"
                  ? "bg-emerald-600 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition ${
                statusFilter === "all"
                  ? "bg-slate-800 text-slate-200 font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <button
          onClick={fetchTickets}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition self-end sm:self-auto"
          title="Refresh Queue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-xs text-slate-500 text-center py-16">Loading tickets queue...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <LifeBuoy className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No tickets found in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              All tickets for this filter have been addressed or resolved.
            </p>
          </div>
        ) : (
          tickets.map((ticket, index) => {
            const isTwitter = ticket.channelType === "twitter";
            const isHigh = ticket.priority === "high";

            return (
              <div
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Priority bar + Customer & Inquiry */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Queue Rank Badge */}
                  <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400 flex-shrink-0">
                    #{index + 1}
                  </div>

                  {/* Customer details */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">{ticket.customerName}</span>
                      <span className="text-xs text-slate-400">{ticket.customerHandle}</span>

                      {/* Channel Pill */}
                      <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {ticket.channelType === "twitter" ? (
                          <>
                            <Twitter className="w-3 h-3 text-sky-400" />
                            <span>Twitter/X</span>
                          </>
                        ) : ticket.channelType === "livechat" ? (
                          <>
                            <MessageCircle className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 font-semibold">Live Chat</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-emerald-400" />
                            <span>Email</span>
                          </>
                        )}
                      </span>

                      {/* Priority Pill */}
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          isHigh
                            ? "bg-rose-950/60 text-rose-300 border-rose-800"
                            : ticket.priority === "medium"
                            ? "bg-amber-950/60 text-amber-300 border-amber-800"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {ticket.priority || "Normal"}
                      </span>

                      {/* Age Pill (Highlight oldest) */}
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Waiting {calculateAge(ticket.createdAt)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      &ldquo;{ticket.snippet}&rdquo;
                    </p>

                    {/* Tags */}
                    {ticket.tags && ticket.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {ticket.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/60"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status actions & link to thread */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  {/* Status Switcher */}
                  {ticket.ticketStatus !== "resolved" ? (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, "resolved")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, "open")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      <span>Reopen</span>
                    </button>
                  )}

                  {ticket.ticketStatus === "open" && (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, "pending")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      Pending
                    </button>
                  )}

                  <Link
                    href={`/inbox`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                  >
                    <span>Reply in Inbox</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
