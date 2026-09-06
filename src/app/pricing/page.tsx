import Link from "next/link";
import {
  Check,
  X as XIcon,
  ShieldCheck,
  Zap,
  Server,
  Download,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { SOLTO_THEME } from "@/lib/theme";

export default function PricingPage() {
  const tiers = [
    {
      name: "Community Self-Hosted",
      badge: "Open Source & Sovereign",
      price: "$0",
      cadence: "forever free",
      description: "Run Solto on your own infrastructure with single-command Docker deployment. Full data sovereignty.",
      features: [
        "100% Data Sovereignty (PostgreSQL)",
        "Single-command Docker Compose",
        "Unified Twitter/X and Email Inbox",
        "Basic Scheduling & Publishing",
        "Keyword & Brand Listening",
        "Automation QA Sandbox (Pre-testing)",
        "Customer Service Tickets Queue",
        "1-Click JSON & CSV Data Export",
        "Unlimited Seats & Users",
      ],
      ctaText: "Deploy Self-Hosted",
      ctaHref: "/onboarding",
      highlighted: false,
    },
    {
      name: "Team Cloud",
      badge: "Most Popular for SMBs",
      price: "$49",
      cadence: "per month",
      description: "Fully managed Solto instance with automatic database backups, zero DevOps maintenance required.",
      features: [
        "Everything in Community Self-Hosted",
        "Managed Cloud Hosting & Updates",
        "Automated Daily PostgreSQL Backups",
        "5 Team Agent Seats included",
        "High-Frequency Channel Polling",
        "Automation QA Sandbox Simulations",
        "Email & Discord Community Support",
        "No Sales Calls — Instant Signup",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/onboarding",
      highlighted: true,
    },
    {
      name: "Growth Agency",
      badge: "For Fast-Growing Teams",
      price: "$149",
      cadence: "per month",
      description: "Expanded capacity for agencies and teams handling high volume customer inquiries and listening streams.",
      features: [
        "Everything in Team Cloud",
        "15 Team Agent Seats included",
        "Real-Time Keyword Listening Ingestion",
        "Unlimited Automation Rules",
        "Full Cross-Module Analytics",
        "Priority Channel API Dispatch",
        "Direct Slack Support Channel",
      ],
      ctaText: "Start Free Trial",
      ctaHref: "/onboarding",
      highlighted: false,
    },
    {
      name: "Dedicated Enterprise",
      badge: "Transparent Pricing",
      price: "$499",
      cadence: "per month",
      description: "Dedicated cluster and infrastructure. Visible pricing with NO forced sales consultation wall.",
      features: [
        "Everything in Growth",
        "Unlimited Team Seats",
        "Dedicated VPC / Isolated Database",
        "99.99% Uptime SLA",
        "Custom SAML / SSO Integration",
        "Dedicated Account Engineer",
        "Zero Sales Gating to Subscribe",
      ],
      ctaText: "Get Enterprise Access",
      ctaHref: "/onboarding",
      highlighted: false,
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Radically Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          No &ldquo;Contact Us&rdquo; Walls. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
            No Enterprise Games.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {SOLTO_THEME.name} was founded on the belief that customer communication software should be accessible, affordable, and transparent. Every tier is clearly priced below with zero sales calls required.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
              tier.highlighted
                ? "bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105"
                : "bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl"
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md">
                Recommended
              </span>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400">{tier.badge}</span>
                <h3 className="text-lg font-bold text-white mt-1">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tier.description}</p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-slate-400">/{tier.cadence}</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="border-t border-slate-800 pt-4 space-y-2.5">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Included:</span>
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={tier.ctaHref}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition ${
                  tier.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Positioning Contrast Table vs. Legacy CXM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Why Solto vs. Enterprise CXM (Sprinklr)</h2>
          <p className="text-xs text-slate-400 mt-1">
            How we compare against complex legacy platforms designed for Fortune 100 procurement teams.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Evaluation Criteria</th>
                <th className="py-3 px-4 text-indigo-400 font-bold">Solto</th>
                <th className="py-3 px-4 text-slate-500">Legacy Enterprise CXM (Sprinklr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Pricing Transparency</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Public tiers, zero sales friction</span>
                </td>
                <td className="py-3 px-4 text-slate-400">Strictly hidden behind mandatory sales calls</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Minimum Contract</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>$0 / month-to-month</span>
                </td>
                <td className="py-3 px-4 text-slate-400">$20,000+ / year locked annual contract</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Data Export & Sovereignty</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>1-Click JSON/CSV & Self-Hosted DB</span>
                </td>
                <td className="py-3 px-4 text-slate-400">Gated behind export requests and exit fees</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Automation Testing</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Pre-activation QA Sandbox</span>
                </td>
                <td className="py-3 px-4 text-slate-400">Untested live activations with regression risks</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Onboarding Time</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Under 10 minutes to first reply</span>
                </td>
                <td className="py-3 px-4 text-slate-400">3 to 6 weeks of onboarding consultant meetings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
