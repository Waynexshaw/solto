import { Pool } from "pg";
import fs from "fs";
import path from "path";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  brandId?: string;
  type: "twitter" | "email" | "livechat";
  name: string;
  handle: string;
  isConnected: boolean;
  credentials?: Record<string, string>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  brandId?: string;
  channelId: string;
  channelType: "twitter" | "email" | "livechat";
  customerName: string;
  customerHandle: string;
  customerAvatar?: string;
  snippet: string;
  unread: boolean;
  isListeningCaught: boolean;
  listeningKeyword?: string;
  // Phase 1 Ticket concept
  isTicket?: boolean;
  ticketStatus?: "open" | "pending" | "resolved";
  priority?: "low" | "medium" | "high";
  tags?: string[];
  // Phase 2 Governance & Approval
  approvalStatus?: "approved" | "pending_approval" | "rejected";
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: "customer" | "agent";
  senderName: string;
  senderHandle: string;
  content: string;
  mediaUrls?: string[];
  channelMessageId?: string;
  status: "delivered" | "pending" | "failed";
  createdAt: string;
}

export interface Keyword {
  id: string;
  brandId?: string;
  keyword: string;
  channel: "twitter" | "email" | "all";
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}

export interface ScheduledPost {
  id: string;
  brandId?: string;
  channelType: "twitter" | "email";
  content: string;
  mediaUrl?: string;
  scheduledFor: string;
  status: "draft" | "scheduled" | "published" | "failed";
  publishedAt?: string;
  approvalStatus?: "approved" | "pending_approval" | "rejected";
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  brandId?: string;
  name: string;
  conditionKeyword: string;
  actionType: "auto_tag" | "auto_reply";
  actionValue: string;
  isActive: boolean;
  lastTestedAt?: string;
  matchCount?: number;
  createdAt: string;
}

// ==============================================================================
// Phase 2 Expansion Interfaces: Brands, Paid Campaigns & Governance
// ==============================================================================

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  primaryColor: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaidCampaign {
  id: string;
  brandId: string;
  name: string;
  budget: number;
  spend: number;
  targetChannel: "twitter" | "email" | "all";
  durationDays: number;
  startDate: string;
  endDate: string;
  headline: string;
  creativeUrl?: string;
  status: "draft" | "active" | "paused" | "completed";
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface GovernanceConfig {
  approvalRequired: boolean;
  complianceWords: string[];
}

export interface ApprovalItem {
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

export interface SoltoDataStore {
  users: User[];
  channels: Channel[];
  conversations: Conversation[];
  messages: Message[];
  keywords: Keyword[];
  scheduledPosts: ScheduledPost[];
  automationRules: AutomationRule[];
  brands: Brand[];
  paidCampaigns: PaidCampaign[];
  governanceConfig: GovernanceConfig;
  approvals: ApprovalItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const JSON_DB_PATH = path.join(DATA_DIR, "solto-storage.json");

const initialSeedData: SoltoDataStore = {
  users: [
    {
      id: "usr_admin",
      email: "founder@solto.io",
      passwordHash: "demo_password_hash",
      name: "Solto Admin",
      role: "owner",
      createdAt: new Date().toISOString(),
    },
  ],
  brands: [
    {
      id: "brand_default",
      name: "Solto Core",
      slug: "solto-core",
      logoText: "⚡ Solto",
      primaryColor: "#4f46e5",
      isDefault: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    },
    {
      id: "brand_lumina",
      name: "Lumina Health (Client)",
      slug: "lumina-health",
      logoText: "🌿 Lumina",
      primaryColor: "#059669",
      isDefault: false,
      createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    },
    {
      id: "brand_vance",
      name: "Vance Agency (Client)",
      slug: "vance-agency",
      logoText: "🚀 Vance",
      primaryColor: "#0284c7",
      isDefault: false,
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    },
  ],
  channels: [
    {
      id: "chn_twitter",
      brandId: "brand_default",
      type: "twitter",
      name: "X / Twitter",
      handle: "@solto_hq",
      isConnected: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    },
    {
      id: "chn_email",
      brandId: "brand_default",
      type: "email",
      name: "Customer Support Email",
      handle: "support@solto.io",
      isConnected: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    },
    {
      id: "chn_livechat",
      brandId: "brand_default",
      type: "livechat",
      name: "Solto Web Live Chat",
      handle: "widget://solto.io/chat",
      isConnected: true,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    },
  ],
  conversations: [
    {
      id: "conv_1",
      brandId: "brand_default",
      channelId: "chn_twitter",
      channelType: "twitter",
      customerName: "Alex Rivera",
      customerHandle: "@alex_dev",
      customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      snippet: "Hey! Does Solto support single-command Docker deployment with PostgreSQL persistence?",
      unread: true,
      isListeningCaught: false,
      isTicket: true,
      ticketStatus: "open",
      priority: "high",
      tags: ["docker", "deployment"],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "conv_2",
      brandId: "brand_default",
      channelId: "chn_email",
      channelType: "email",
      customerName: "Sarah Chen",
      customerHandle: "sarah@luminahealth.io",
      customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      snippet: "We are migrating away from Sprinklr due to excessive pricing. Can we export all historical data at any time?",
      unread: true,
      isListeningCaught: false,
      isTicket: true,
      ticketStatus: "open",
      priority: "medium",
      tags: ["migration", "export"],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "conv_3",
      brandId: "brand_default",
      channelId: "chn_twitter",
      channelType: "twitter",
      customerName: "Dan K. Miller",
      customerHandle: "@techlead_dan",
      customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      snippet: "Thinking about testing #Solto for our team's unified inbox. Anyone tried their keyword listening?",
      unread: false,
      isListeningCaught: true,
      listeningKeyword: "Solto",
      isTicket: true,
      ticketStatus: "pending",
      priority: "low",
      tags: ["social-listening"],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "conv_4",
      brandId: "brand_default",
      channelId: "chn_email",
      channelType: "email",
      customerName: "Marcus Vance",
      customerHandle: "marcus@vancemedia.agency",
      customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      snippet: "Thanks for the swift reply earlier. Our test webhook passed with flying colors!",
      unread: false,
      isListeningCaught: false,
      isTicket: true,
      ticketStatus: "resolved",
      priority: "low",
      tags: ["resolved", "webhook"],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    },
    // Phase 2: Live Chat Channel Support
    {
      id: "conv_5",
      brandId: "brand_default",
      channelId: "chn_livechat",
      channelType: "livechat",
      customerName: "Elena Rostova",
      customerHandle: "visitor_elena@web",
      customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
      snippet: "Hello! We are testing your Live Chat channel. Can we route multi-brand client chat queues separately?",
      unread: true,
      isListeningCaught: false,
      isTicket: true,
      ticketStatus: "open",
      priority: "high",
      tags: ["live-chat", "agency-inquiry"],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  messages: [
    {
      id: "msg_1_1",
      conversationId: "conv_1",
      senderType: "customer",
      senderName: "Alex Rivera",
      senderHandle: "@alex_dev",
      content: "Hey! Does Solto support single-command Docker deployment with PostgreSQL persistence?",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "msg_2_1",
      conversationId: "conv_2",
      senderType: "customer",
      senderName: "Sarah Chen",
      senderHandle: "sarah@luminahealth.io",
      content: "Hello Solto team,\n\nWe are currently evaluating simpler CXM options to replace Sprinklr. We need to ensure we have zero vendor lock-in. Can we export all historical conversations as JSON or CSV anytime?",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "msg_3_1",
      conversationId: "conv_3",
      senderType: "customer",
      senderName: "Dan K. Miller",
      senderHandle: "@techlead_dan",
      content: "Thinking about testing #Solto for our team's unified inbox. Anyone tried their keyword listening? Looking for an open alternative to enterprise bloat.",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "msg_4_1",
      conversationId: "conv_4",
      senderType: "customer",
      senderName: "Marcus Vance",
      senderHandle: "marcus@vancemedia.agency",
      content: "Could you confirm if API rate limits apply to self-hosted instances?",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    },
    {
      id: "msg_4_2",
      conversationId: "conv_4",
      senderType: "agent",
      senderName: "Solto Support",
      senderHandle: "support@solto.io",
      content: "Hi Marcus, no limits! Self-hosted Solto instances communicate directly with your own provider credentials (Twitter / SMTP / Resend), so there are no Solto middleman tiers.",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    },
    {
      id: "msg_5_1",
      conversationId: "conv_5",
      senderType: "customer",
      senderName: "Elena Rostova",
      senderHandle: "visitor_elena@web",
      content: "Hello! We are testing your Live Chat channel. Can we route multi-brand client chat queues separately?",
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  keywords: [
    {
      id: "kw_1",
      brandId: "brand_default",
      keyword: "Solto",
      channel: "all",
      isActive: true,
      matchCount: 14,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ],
  scheduledPosts: [
    {
      id: "sch_1",
      brandId: "brand_default",
      channelType: "twitter",
      content: "Solto Phase 2 is live! 🚀 Paid campaign planning, Live Chat support, Governance workflows, and Multi-brand white-labeling.",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop",
      scheduledFor: new Date(Date.now() + 3600000 * 4).toISOString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
  ],
  automationRules: [
    {
      id: "rule_1",
      brandId: "brand_default",
      name: "Sprinklr Migration Intent",
      conditionKeyword: "Sprinklr",
      actionType: "auto_tag",
      actionValue: "High Intent / Migration",
      isActive: false,
      lastTestedAt: new Date(Date.now() - 3600000).toISOString(),
      matchCount: 1,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  paidCampaigns: [
    {
      id: "camp_1",
      brandId: "brand_default",
      name: "Q3 Open CXM Alternative Blitz",
      budget: 3500,
      spend: 1840,
      targetChannel: "twitter",
      durationDays: 30,
      startDate: new Date(Date.now() - 3600000 * 24 * 10).toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 3600000 * 24 * 20).toISOString().slice(0, 10),
      headline: "Stop paying $50,000/yr for Sprinklr. Deploy Solto in 60 seconds.",
      creativeUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      status: "active",
      impressions: 48920,
      clicks: 1740,
      createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    },
    {
      id: "camp_2",
      brandId: "brand_lumina",
      name: "Lumina Patient Portal Expansion",
      budget: 1200,
      spend: 420,
      targetChannel: "email",
      durationDays: 14,
      startDate: new Date(Date.now() - 3600000 * 24 * 4).toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 3600000 * 24 * 10).toISOString().slice(0, 10),
      headline: "Unified Patient Care Communications with Zero Data Lock-In.",
      creativeUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop",
      status: "active",
      impressions: 12400,
      clicks: 890,
      createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    },
  ],
  governanceConfig: {
    approvalRequired: false, // Optional by default to avoid burdening single-brand SMBs
    complianceWords: [
      "guaranteed return",
      "100% refund guaranteed",
      "confidential insider",
      "warranted profit",
      "unconditional warranty",
    ],
  },
  approvals: [
    {
      id: "appr_1",
      type: "reply",
      targetChannel: "twitter",
      authorName: "Junior Agent (Dave)",
      recipientOrChannel: "@alex_dev",
      content: "We provide an unconditional 100% warranty on all server performance metrics.",
      status: "pending",
      feedbackNote: "Flagged by compliance engine: phrase 'unconditional warranty' detected.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
};

let pgPool: Pool | null = null;

function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  if (!pgPool) {
    pgPool = new Pool({ connectionString, max: 10 });
  }
  return pgPool;
}

function ensureLocalDb(): SoltoDataStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialSeedData, null, 2), "utf-8");
    return initialSeedData;
  }
  try {
    const raw = fs.readFileSync(JSON_DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    let mutated = false;
    if (!parsed.brands) {
      parsed.brands = initialSeedData.brands;
      mutated = true;
    }
    if (!parsed.paidCampaigns) {
      parsed.paidCampaigns = initialSeedData.paidCampaigns;
      mutated = true;
    }
    if (!parsed.governanceConfig) {
      parsed.governanceConfig = initialSeedData.governanceConfig;
      mutated = true;
    }
    if (!parsed.approvals) {
      parsed.approvals = initialSeedData.approvals;
      mutated = true;
    }
    if (mutated) {
      writeLocalDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Error reading JSON database, restoring seed data:", err);
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialSeedData, null, 2), "utf-8");
    return initialSeedData;
  }
}

function writeLocalDb(data: SoltoDataStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

let isPgInitialized = false;

async function initPostgresTables(pool: Pool) {
  if (isPgInitialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'agent',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      logo_text TEXT NOT NULL,
      primary_color TEXT DEFAULT '#4f46e5',
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      brand_id TEXT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      is_connected BOOLEAN DEFAULT true,
      credentials JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      brand_id TEXT,
      channel_id TEXT NOT NULL,
      channel_type TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_handle TEXT NOT NULL,
      customer_avatar TEXT,
      snippet TEXT,
      unread BOOLEAN DEFAULT true,
      is_listening_caught BOOLEAN DEFAULT false,
      listening_keyword TEXT,
      is_ticket BOOLEAN DEFAULT true,
      ticket_status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'medium',
      tags JSONB DEFAULT '[]'::jsonb,
      approval_status TEXT DEFAULT 'approved',
      last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_type TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_handle TEXT NOT NULL,
      content TEXT NOT NULL,
      media_urls JSONB,
      channel_message_id TEXT,
      status TEXT DEFAULT 'delivered',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS paid_campaigns (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL,
      name TEXT NOT NULL,
      budget NUMERIC NOT NULL,
      spend NUMERIC DEFAULT 0,
      target_channel TEXT NOT NULL,
      duration_days INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      headline TEXT NOT NULL,
      creative_url TEXT,
      status TEXT DEFAULT 'active',
      impressions INT DEFAULT 0,
      clicks INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS governance_config (
      id INT PRIMARY KEY DEFAULT 1,
      approval_required BOOLEAN DEFAULT false,
      compliance_words JSONB DEFAULT '[]'::jsonb
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      target_channel TEXT NOT NULL,
      author_name TEXT NOT NULL,
      recipient_or_channel TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      feedback_note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  isPgInitialized = true;
}

export const db = {
  // Brand & Multi-Tenant Management (Phase 2 White-Label)
  async getBrands(): Promise<Brand[]> {
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      const res = await pool.query("SELECT * FROM brands ORDER BY is_default DESC, name ASC");
      return res.rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        logoText: r.logo_text,
        primaryColor: r.primary_color,
        isDefault: r.is_default,
        createdAt: r.created_at?.toISOString?.() || r.created_at,
      }));
    }
    const store = ensureLocalDb();
    return store.brands || [];
  },

  async addBrand(brand: Omit<Brand, "id" | "createdAt" | "isDefault">): Promise<Brand> {
    const newBrand: Brand = {
      ...brand,
      id: "brand_" + Date.now(),
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      await pool.query(
        "INSERT INTO brands (id, name, slug, logo_text, primary_color, is_default, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [newBrand.id, newBrand.name, newBrand.slug, newBrand.logoText, newBrand.primaryColor, newBrand.isDefault, newBrand.createdAt]
      );
      return newBrand;
    }
    const store = ensureLocalDb();
    if (!store.brands) store.brands = [];
    store.brands.push(newBrand);
    writeLocalDb(store);
    return newBrand;
  },

  async getConversations(filter?: { channel?: string; unreadOnly?: boolean; listeningOnly?: boolean; brandId?: string }): Promise<Conversation[]> {
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      let query = "SELECT * FROM conversations WHERE 1=1";
      const params: any[] = [];
      if (filter?.channel && filter.channel !== "all") {
        params.push(filter.channel);
        query += ` AND channel_type = $${params.length}`;
      }
      if (filter?.unreadOnly) {
        query += " AND unread = true";
      }
      if (filter?.listeningOnly) {
        query += " AND is_listening_caught = true";
      }
      if (filter?.brandId && filter.brandId !== "all") {
        params.push(filter.brandId);
        query += ` AND brand_id = $${params.length}`;
      }
      query += " ORDER BY last_message_at DESC";
      const res = await pool.query(query, params);
      return res.rows.map((r) => ({
        id: r.id,
        brandId: r.brand_id,
        channelId: r.channel_id,
        channelType: r.channel_type,
        customerName: r.customer_name,
        customerHandle: r.customer_handle,
        customerAvatar: r.customer_avatar,
        snippet: r.snippet,
        unread: r.unread,
        isListeningCaught: r.is_listening_caught,
        listeningKeyword: r.listening_keyword,
        isTicket: r.is_ticket ?? true,
        ticketStatus: r.ticket_status ?? "open",
        priority: r.priority ?? "medium",
        tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
        approvalStatus: r.approval_status ?? "approved",
        lastMessageAt: r.last_message_at?.toISOString?.() || r.last_message_at,
        createdAt: r.created_at?.toISOString?.() || r.created_at,
      }));
    }

    const store = ensureLocalDb();
    let result = [...store.conversations];
    if (filter?.channel && filter.channel !== "all") {
      result = result.filter((c) => c.channelType === filter.channel);
    }
    if (filter?.unreadOnly) {
      result = result.filter((c) => c.unread);
    }
    if (filter?.listeningOnly) {
      result = result.filter((c) => c.isListeningCaught);
    }
    if (filter?.brandId && filter.brandId !== "all") {
      result = result.filter((c) => c.brandId === filter.brandId || (!c.brandId && filter.brandId === "brand_default"));
    }
    return result.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  async getConversationById(id: string): Promise<Conversation | null> {
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      const res = await pool.query("SELECT * FROM conversations WHERE id = $1", [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        brandId: r.brand_id,
        channelId: r.channel_id,
        channelType: r.channel_type,
        customerName: r.customer_name,
        customerHandle: r.customer_handle,
        customerAvatar: r.customer_avatar,
        snippet: r.snippet,
        unread: r.unread,
        isListeningCaught: r.is_listening_caught,
        listeningKeyword: r.listening_keyword,
        isTicket: r.is_ticket ?? true,
        ticketStatus: r.ticket_status ?? "open",
        priority: r.priority ?? "medium",
        tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
        approvalStatus: r.approval_status ?? "approved",
        lastMessageAt: r.last_message_at?.toISOString?.() || r.last_message_at,
        createdAt: r.created_at?.toISOString?.() || r.created_at,
      };
    }

    const store = ensureLocalDb();
    return store.conversations.find((c) => c.id === id) || null;
  },

  async markConversationRead(id: string): Promise<void> {
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      await pool.query("UPDATE conversations SET unread = false WHERE id = $1", [id]);
      return;
    }
    const store = ensureLocalDb();
    const conv = store.conversations.find((c) => c.id === id);
    if (conv) {
      conv.unread = false;
      writeLocalDb(store);
    }
  },

  async getTickets(filter?: { status?: string; priority?: string; brandId?: string }): Promise<Conversation[]> {
    const pool = getPgPool();
    if (pool) {
      await initPostgresTables(pool);
      let query = "SELECT * FROM conversations WHERE is_ticket = true";
      const params: any[] = [];
      if (filter?.status && filter.status !== "all") {
        params.push(filter.status);
        query += ` AND ticket_status = $${params.length}`;
      }
      if (filter?.priority && filter.priority !== "all") {
        params.push(filter.priority);
        query += ` AND priority = $${params.length}`;
      }
      if (filter?.brandId && filter.brandId !== "all") {
        params.push(filter.brandId);
        query += ` AND brand_id = $${params.length}`;
      }
      query += " ORDER BY created_at ASC";
      const res = await pool.query(query, params);
      return res.rows.map((r) => ({
        id: r.id,
        brandId: r.brand_id,
        channelId: r.channel_id,
        channelType: r.channel_type,
        customerName: r.customer_name,
        customerHandle: r.customer_handle,
        customerAvatar: r.customer_avatar,
        snippet: r.snippet,
        unread: r.unread,
        isListeningCaught: r.is_listening_caught,
        listeningKeyword: r.listening_keyword,
        isTicket: r.is_ticket ?? true,
        ticketStatus: r.ticket_status ?? "open",
        priority: r.priority ?? "medium",
        tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
        approvalStatus: r.approval_status ?? "approved",
        lastMessageAt: r.last_message_at?.toISOString?.() || r.last_message_at,
        createdAt: r.created_at?.toISOString?.() || r.created_at,
      }));
    }

    const store = ensureLocalDb();
    let tickets = store.conversations.filter((c) => c.isTicket !== false);
    if (filter?.status && filter.status !== "all") {
      tickets = tickets.filter((c) => c.ticketStatus === filter.status);
    }
    if (filter?.priority && filter.priority !== "all") {
      tickets = tickets.filter((c) => c.priority === filter.priority);
    }
    if (filter?.brandId && filter.brandId !== "all") {
      tickets = tickets.filter((c) => c.brandId === filter.brandId || (!c.brandId && filter.brandId === "brand_default"));
    }
    return tickets.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async updateTicket(id: string, updates: { status?: "open" | "pending" | "resolved"; priority?: "low" | "medium" | "high"; tags?: string[] }): Promise<Conversation | null> {
    const store = ensureLocalDb();
    const conv = store.conversations.find((c) => c.id === id);
    if (!conv) return null;
    if (updates.status) conv.ticketStatus = updates.status;
    if (updates.priority) conv.priority = updates.priority;
    if (updates.tags) conv.tags = updates.tags;
    writeLocalDb(store);
    return conv;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const store = ensureLocalDb();
    return store.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async addMessage(msg: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const newMessage: Message = {
      ...msg,
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    store.messages.push(newMessage);
    const conv = store.conversations.find((c) => c.id === newMessage.conversationId);
    if (conv) {
      conv.snippet = newMessage.content.slice(0, 100);
      conv.lastMessageAt = newMessage.createdAt;
    }
    writeLocalDb(store);
    return newMessage;
  },

  async createConversation(conv: Omit<Conversation, "id" | "createdAt" | "lastMessageAt"> & { initialMessage?: string }): Promise<Conversation> {
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id: "conv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      brandId: conv.brandId || "brand_default",
      channelId: conv.channelId,
      channelType: conv.channelType,
      customerName: conv.customerName,
      customerHandle: conv.customerHandle,
      customerAvatar: conv.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      snippet: conv.snippet || conv.initialMessage?.slice(0, 100) || "New conversation",
      unread: conv.unread ?? true,
      isListeningCaught: conv.isListeningCaught ?? false,
      listeningKeyword: conv.listeningKeyword,
      isTicket: conv.isTicket ?? true,
      ticketStatus: conv.ticketStatus ?? "open",
      priority: conv.priority ?? "medium",
      tags: conv.tags || [],
      approvalStatus: conv.approvalStatus ?? "approved",
      lastMessageAt: now,
      createdAt: now,
    };

    const store = ensureLocalDb();
    store.conversations.unshift(newConv);
    if (conv.initialMessage) {
      store.messages.push({
        id: "msg_" + Date.now(),
        conversationId: newConv.id,
        senderType: "customer",
        senderName: newConv.customerName,
        senderHandle: newConv.customerHandle,
        content: conv.initialMessage,
        status: "delivered",
        createdAt: now,
      });
    }
    writeLocalDb(store);
    return newConv;
  },

  async getChannels(brandId?: string): Promise<Channel[]> {
    const store = ensureLocalDb();
    if (brandId && brandId !== "all") {
      return store.channels.filter((c) => c.brandId === brandId || !c.brandId);
    }
    return store.channels;
  },

  async updateChannel(id: string, updates: Partial<Channel>): Promise<Channel | null> {
    const store = ensureLocalDb();
    const ch = store.channels.find((c) => c.id === id);
    if (!ch) return null;
    Object.assign(ch, updates);
    writeLocalDb(store);
    return ch;
  },

  async getKeywords(): Promise<Keyword[]> {
    const store = ensureLocalDb();
    return store.keywords;
  },

  async addKeyword(keyword: string, channel: "twitter" | "email" | "all" = "all"): Promise<Keyword> {
    const newKw: Keyword = {
      id: "kw_" + Date.now(),
      keyword: keyword.trim(),
      channel,
      isActive: true,
      matchCount: 0,
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    store.keywords.unshift(newKw);
    writeLocalDb(store);
    return newKw;
  },

  async deleteKeyword(id: string): Promise<void> {
    const store = ensureLocalDb();
    store.keywords = store.keywords.filter((k) => k.id !== id);
    writeLocalDb(store);
  },

  async getScheduledPosts(): Promise<ScheduledPost[]> {
    const store = ensureLocalDb();
    return store.scheduledPosts.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  },

  async addScheduledPost(post: Omit<ScheduledPost, "id" | "createdAt">): Promise<ScheduledPost> {
    const newPost: ScheduledPost = {
      ...post,
      id: "sch_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    store.scheduledPosts.push(newPost);
    writeLocalDb(store);
    return newPost;
  },

  async getAutomationRules(): Promise<AutomationRule[]> {
    const store = ensureLocalDb();
    return store.automationRules || [];
  },

  async addAutomationRule(rule: Omit<AutomationRule, "id" | "createdAt">): Promise<AutomationRule> {
    const newRule: AutomationRule = {
      ...rule,
      id: "rule_" + Date.now(),
      isActive: false,
      matchCount: 0,
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    if (!store.automationRules) store.automationRules = [];
    store.automationRules.unshift(newRule);
    writeLocalDb(store);
    return newRule;
  },

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule | null> {
    const store = ensureLocalDb();
    const r = store.automationRules?.find((rule) => rule.id === id);
    if (!r) return null;
    Object.assign(r, updates);
    writeLocalDb(store);
    return r;
  },

  async deleteAutomationRule(id: string): Promise<void> {
    const store = ensureLocalDb();
    store.automationRules = (store.automationRules || []).filter((r) => r.id !== id);
    writeLocalDb(store);
  },

  async testRuleAgainstHistory(rule: { conditionKeyword: string; actionType: string; actionValue: string; ruleId?: string }) {
    const store = ensureLocalDb();
    const keyword = rule.conditionKeyword.toLowerCase();
    const conversationMap = new Map(store.conversations.map((c) => [c.id, c]));

    const matches: Array<{
      messageId: string;
      conversationId: string;
      customerName: string;
      customerHandle: string;
      channelType: string;
      messageContent: string;
      timestamp: string;
      wouldAction: string;
    }> = [];

    for (const msg of store.messages) {
      if (msg.content.toLowerCase().includes(keyword)) {
        const conv = conversationMap.get(msg.conversationId);
        matches.push({
          messageId: msg.id,
          conversationId: msg.conversationId,
          customerName: conv?.customerName || msg.senderName,
          customerHandle: conv?.customerHandle || msg.senderHandle,
          channelType: conv?.channelType || "unknown",
          messageContent: msg.content,
          timestamp: msg.createdAt,
          wouldAction:
            rule.actionType === "auto_tag"
              ? `Apply Tag: "${rule.actionValue}"`
              : `Send Auto-Reply: "${rule.actionValue}"`,
        });
      }
    }

    if (rule.ruleId) {
      await this.updateAutomationRule(rule.ruleId, {
        lastTestedAt: new Date().toISOString(),
        matchCount: matches.length,
      });
    }

    return {
      totalScanned: store.messages.length,
      totalMatches: matches.length,
      matches,
      testedAt: new Date().toISOString(),
    };
  },

  // ============================================================================
  // Phase 2: Paid / Ads Planning Engine
  // ============================================================================
  async getPaidCampaigns(brandId?: string): Promise<PaidCampaign[]> {
    const store = ensureLocalDb();
    let campaigns = store.paidCampaigns || [];
    if (brandId && brandId !== "all") {
      campaigns = campaigns.filter((c) => c.brandId === brandId);
    }
    return campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addPaidCampaign(camp: Omit<PaidCampaign, "id" | "createdAt" | "spend" | "impressions" | "clicks">): Promise<PaidCampaign> {
    const newCamp: PaidCampaign = {
      ...camp,
      id: "camp_" + Date.now(),
      spend: 0,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    if (!store.paidCampaigns) store.paidCampaigns = [];
    store.paidCampaigns.unshift(newCamp);
    writeLocalDb(store);
    return newCamp;
  },

  async updatePaidCampaign(id: string, updates: Partial<PaidCampaign>): Promise<PaidCampaign | null> {
    const store = ensureLocalDb();
    const c = store.paidCampaigns?.find((camp) => camp.id === id);
    if (!c) return null;
    Object.assign(c, updates);
    writeLocalDb(store);
    return c;
  },

  async deletePaidCampaign(id: string): Promise<void> {
    const store = ensureLocalDb();
    store.paidCampaigns = (store.paidCampaigns || []).filter((c) => c.id !== id);
    writeLocalDb(store);
  },

  // ============================================================================
  // Phase 2: Governance (Approvals & Compliance Engine)
  // ============================================================================
  async getGovernanceConfig(): Promise<GovernanceConfig> {
    const store = ensureLocalDb();
    return store.governanceConfig || { approvalRequired: false, complianceWords: [] };
  },

  async updateGovernanceConfig(config: Partial<GovernanceConfig>): Promise<GovernanceConfig> {
    const store = ensureLocalDb();
    if (!store.governanceConfig) {
      store.governanceConfig = { approvalRequired: false, complianceWords: [] };
    }
    Object.assign(store.governanceConfig, config);
    writeLocalDb(store);
    return store.governanceConfig;
  },

  async getApprovals(): Promise<ApprovalItem[]> {
    const store = ensureLocalDb();
    return store.approvals || [];
  },

  async addApprovalItem(item: Omit<ApprovalItem, "id" | "createdAt" | "status">): Promise<ApprovalItem> {
    const newItem: ApprovalItem = {
      ...item,
      id: "appr_" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const store = ensureLocalDb();
    if (!store.approvals) store.approvals = [];
    store.approvals.unshift(newItem);
    writeLocalDb(store);
    return newItem;
  },

  async reviewApprovalItem(id: string, action: "approved" | "rejected", feedbackNote?: string): Promise<ApprovalItem | null> {
    const store = ensureLocalDb();
    const item = store.approvals?.find((a) => a.id === id);
    if (!item) return null;
    item.status = action;
    if (feedbackNote) item.feedbackNote = feedbackNote;
    writeLocalDb(store);
    return item;
  },

  async checkCompliance(content: string): Promise<{ isCompliant: boolean; flaggedWords: string[] }> {
    const config = await this.getGovernanceConfig();
    const flaggedWords: string[] = [];
    const lower = content.toLowerCase();

    for (const phrase of config.complianceWords) {
      if (lower.includes(phrase.toLowerCase())) {
        flaggedWords.push(phrase);
      }
    }

    return {
      isCompliant: flaggedWords.length === 0,
      flaggedWords,
    };
  },

  async getAnalyticsSummary() {
    const store = ensureLocalDb();
    const totalConversations = store.conversations.length;
    const totalMessages = store.messages.length;

    const twitterCount = store.conversations.filter((c) => c.channelType === "twitter").length;
    const emailCount = store.conversations.filter((c) => c.channelType === "email").length;
    const livechatCount = store.conversations.filter((c) => c.channelType === "livechat").length;

    const listeningCount = store.conversations.filter((c) => c.isListeningCaught).length;
    const directCount = totalConversations - listeningCount;

    const openTickets = store.conversations.filter((c) => c.isTicket !== false && c.ticketStatus === "open").length;
    const pendingTickets = store.conversations.filter((c) => c.ticketStatus === "pending").length;
    const resolvedTickets = store.conversations.filter((c) => c.ticketStatus === "resolved").length;

    return {
      totalConversations,
      totalMessages,
      byChannel: {
        twitter: twitterCount,
        email: emailCount,
        livechat: livechatCount,
      },
      bySource: {
        direct: directCount,
        listening: listeningCount,
      },
      tickets: {
        total: openTickets + pendingTickets + resolvedTickets,
        open: openTickets,
        pending: pendingTickets,
        resolved: resolvedTickets,
      },
      avgResponseTimeSeconds: 420,
      avgResponseFormatted: "7m 00s",
    };
  },

  async getAllDataForExport(): Promise<SoltoDataStore> {
    return ensureLocalDb();
  },
};
