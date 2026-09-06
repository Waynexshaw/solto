import Link from "next/link";
import {
  Inbox,
  Sparkles,
  Calendar,
  Radio,
  Download,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Mail,
  Zap,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";
import { SOLTO_THEME } from "@/lib/theme";

export default function HomePage() {
  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>The Simpler, Open Alternative to Enterprise CXM</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Unified Customer Inbox. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
            Zero Enterprise Bloat.
          </span>
        </h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {SOLTO_THEME.name} connects your customer conversations from Twitter/X and Email into one fast, self-hostable workspace. No forced sales calls, no vendor lock-in.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/inbox"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition"
          >
            <Inbox className="w-4 h-4" />
            <span>Open Unified Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Guided Onboarding (&lt; 10m)</span>
          </Link>
        </div>
      </div>

      {/* Core Phase 0 Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Unified Multi-Channel Inbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consolidates incoming Twitter/X DMs, mentions, and customer emails in a single screen. Reply directly through live APIs with real delivery receipts.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1"><Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter/X</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-400" /> Email</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Brand & Keyword Listening</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Track keywords and brand names across public posts even when your handle wasn&apos;t tagged. Visually flagged in the inbox as &ldquo;caught by listening&rdquo;.
          </p>
          <div className="pt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-200 border border-amber-800">
              ⚡ Distinct Listening Badges
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Self-Hosted Data Sovereignty</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deploy in seconds via Docker Compose with a dedicated PostgreSQL database. Export complete conversations and threads to JSON or CSV anytime.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1-Click JSON/CSV Export from Day 1</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Explore Phase 0 Modules</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and interact with each component of the MVP.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/schedule"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scheduling & Publishing</span>
          </Link>
          <Link
            href="/listening"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Keyword Listening</span>
          </Link>
          <Link
            href="/export"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Export</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
