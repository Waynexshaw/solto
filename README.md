# ⚡ Solto — The Sovereign Customer Inbox (Phase 2 Expansion)

> **A self-hostable, unified inbox for customer conversations, built as a simpler, open alternative to enterprise CXM tools like Sprinklr.**

Solto targets small-to-mid-sized businesses and agencies who are priced out of enterprise customer experience platforms.

---

## 🎯 Core Value Propositions

1. **Self-Serve Signup & Onboarding**: No mandatory sales rep calls. A new user reaches *"first reply sent"* in **under 10 minutes** with no manual assistance.
2. **Radically Simple to Learn**: Intuitive unified inbox designed directly against Sprinklr's multi-layered complexity.
3. **Pre-Activation Automation QA**: Differentiating sandbox allowing teams to test automation rules against historical data before going live.
4. **Mid-Market & Agency Scalability**: First-class paid ads planning, live chat widget support, two-person approval workflows, compliance word flagging, and multi-brand white-labeling under one login.
5. **Self-Hostable & Sovereign**: You own 100% of your data. Powered by PostgreSQL, single-command Docker deployment, and 1-click JSON/CSV exports from day one.

---

## 🚀 Quick Start Guide

### Option A: One-Command Docker Deployment (Recommended for Production)

Make sure you have Docker & Docker Compose installed, then run:

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start PostgreSQL and Solto
docker compose up -d

# 3. Open your browser
# Navigate to http://localhost:3000
```

This spins up:
- **`solto-postgres`**: PostgreSQL 16 database with persistent Docker volume `solto_pgdata`.
- **`solto-app`**: Next.js application container pre-connected to PostgreSQL.

---

### Option B: Local Developer Mode

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open your browser at http://localhost:3000
```

> **Zero-Friction Local Dev**: If `DATABASE_URL` is not set, Solto seamlessly persists into `./data/solto-storage.json` so you can test all features immediately without installing local database daemons. When `DATABASE_URL` is set, it connects directly to PostgreSQL.

---

## ✨ Features Implemented Across Phases 0, 1 & 2

### 1. Unified Inbox (`/inbox`)
- **Tri-Channel Aggregation**: Supports **Twitter/X** (DMs, mentions), **Customer Support Email**, and **Live Chat**.
- **Conversation Stream**: Customer name/handle, channel badge, preview snippet, read/unread indicator, and ticket status switcher.
- **Thread Inspection**: Full chronological message thread view with sender attribution and timestamps.
- **Direct Reply Dispatch**: In-app reply composer with live API transmission (`/api/messages/send`) and real-time pre-send compliance scanning!

### 2. Paid / Ads Campaign Planning (`/campaigns`) — *Phase 2 Expansion*
- **First-Class Ad Management**: Dedicated paid campaigns dashboard, completely separate from organic scheduling.
- **Campaign Fields**: Total budget, spend to date, duration (days), target channel (Twitter Promoted Ads or Email Sponsored Broadcasts), ad headline/copy, and linked creative asset preview.
- **Performance Simulation**: Real-time impressions, click counter, and click-through rate (CTR) tracking.

### 3. Voice & Live Chat Channel Support (`/chat` & `/tickets`) — *Phase 2 Expansion*
- **Live Chat Channel**: Ingests real-time visitor chats into the Customer Service Ticket queue alongside Twitter and Email.
- **Interactive Chat Widget Simulator (`/chat`)**: Test live inbound customer inquiries with immediate ticket generation.

### 4. Governance Tooling (`/governance`) — *Phase 2 Expansion*
- **Two-Tier Approval Workflow**: Optional setting to route outbound replies and scheduled posts to a second user for review before live dispatch.
- **Pending Approvals Queue**: Review queue where supervisors inspect message content, author, and target before approving or rejecting.
- **Compliance Flagging Engine**: Configurable list of restricted words/phrases (e.g., `"guaranteed return"`, `"100% refund"`, `"unconditional warranty"`). Triggers instant warning banners before messages are sent.

### 5. White-Label & Multi-Brand Support (`/brands`) — *Phase 2 Expansion*
- **Agency Client Management**: Manage multiple sub-brands or client partitions under one login.
- **Custom Branding**: Dedicated logo text and custom primary accent colors per brand.
- **Zero Data Contamination**: Client conversations, tickets, and ad campaigns are cleanly isolated.
- **Optional Simplicity**: Single-brand SMB users can remain on the default brand without added configuration.

### 6. Automation QA Sandbox (`/automations`) — *Phase 1 Differentiator*
- **Rule Builder**: Define automation rules (`if contains X, auto-tag as Y` or `auto-reply with Y`).
- **Pre-Activation Historical Simulation**: Test rules against your entire past conversation archive (`/api/automations/test`) before going live.
- **Activation Safety Gate**: Operators must review the simulation results before activating rules in production.

### 7. Customer Service Tickets Queue (`/tickets`) — *Phase 1 Feature*
- **Ticket Concept**: Conversations marked as tickets with statuses (`open` | `pending` | `resolved`) and priorities (`high` | `medium` | `low`).
- **Oldest-First Priority Queue**: Sorted by **oldest first by default** to protect customer response SLAs.

### 8. Cross-Module Reporting Dashboard (`/analytics`) — *Phase 1 Feature*
- **Channel Volume Breakdown**: Real-time comparison across Twitter/X, Email, and Live Chat.
- **Average Response Time**: Automated tracking with SLA `< 10m` benchmark indicator.
- **Listening vs. Direct Inbound Ratio**: Cross-module comparison showing inquiries from Keyword Listening vs. direct inbound.

### 9. Transparent Public Pricing Page (`/pricing`) — *Phase 1 Feature*
- **Public Accessibility**: Genuinely accessible marketing page without requiring login.
- **No Sales Walls**: Clear tiers ($0 Community, $49/mo Team, $149/mo Growth, $499/mo Enterprise) with zero sales calls required.

### 10. Sovereign Data Export (`/export`)
- **1-Click UI Export**: Download your complete dataset anytime as **JSON** or flattened tabular **CSV**.
- **Headless CLI Command**: Run `npm run export` to save exports into `./exports/`.

---

## 🚀 Moving Further Upmarket: Enterprise Roadmap Notes

Per the specification, here is what would be needed next to move further upmarket (to be built in future enterprise iterations):

1. **Enterprise SSO / SAML Integration**
   - Integration with enterprise identity providers: Okta, Microsoft Entra ID (Azure AD), Google Workspace SAML, and PingIdentity.
   - Just-in-Time (JIT) user provisioning and SCIM directory synchronization for automated team member onboarding/offboarding.

2. **Immutable Audit Logs & Compliance Trails**
   - Tamper-evident, cryptographically verifiable audit log recording all agent actions, message exports, rule activations, and configuration changes.
   - SIEM integration (streaming audit events to Datadog, Splunk, or AWS CloudWatch).

3. **Formal Compliance Certifications**
   - **SOC 2 Type II**: Independent audit verifying Security, Availability, and Confidentiality trust principles.
   - **HIPAA Business Associate Agreement (BAA)**: Data encryption at rest and in transit for healthcare client sub-brands (e.g. Lumina Health).
   - **GDPR / CCPA Data Subject Request (DSR) Automation**: 1-click customer data deletion and anonymization workflows.

4. **Role-Based Access Control (RBAC)**
   - Granular permission tiers: Administrator, Supervisor/Approver, Standard Agent, and Read-Only Auditor, scoped at the sub-brand level.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4 + Central Theme Config (`src/lib/theme.ts`)
- **Icons**: Lucide React + Custom Twitter/X SVG Component
- **Database**: PostgreSQL 16 + Node-Postgres (`pg`) with automatic table migrations and local dev fallback
- **Containerization**: Docker multi-stage build + Docker Compose
