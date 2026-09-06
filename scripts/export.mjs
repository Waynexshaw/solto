import fs from "fs";
import path from "path";
import pg from "pg";
const { Pool } = pg;

const EXPORT_DIR = path.join(process.cwd(), "exports");
const DATA_DIR = path.join(process.cwd(), "data");
const JSON_DB_PATH = path.join(DATA_DIR, "solto-storage.json");

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

async function runExport() {
  console.log("⚡ Solto Sovereign Data Export CLI");
  console.log("----------------------------------");

  let data;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    console.log("Connecting to PostgreSQL at:", connectionString.replace(/:[^:@]+@/, ":***@"));
    const pool = new Pool({ connectionString });
    try {
      const [u, ch, c, m, k, sp] = await Promise.all([
        pool.query("SELECT * FROM users").catch(() => ({ rows: [] })),
        pool.query("SELECT * FROM channels").catch(() => ({ rows: [] })),
        pool.query("SELECT * FROM conversations").catch(() => ({ rows: [] })),
        pool.query("SELECT * FROM messages").catch(() => ({ rows: [] })),
        pool.query("SELECT * FROM keywords").catch(() => ({ rows: [] })),
        pool.query("SELECT * FROM scheduled_posts").catch(() => ({ rows: [] })),
      ]);
      data = {
        users: u.rows,
        channels: ch.rows,
        conversations: c.rows,
        messages: m.rows,
        keywords: k.rows,
        scheduledPosts: sp.rows,
      };
      await pool.end();
    } catch (err) {
      console.warn("PostgreSQL query failed, attempting local fallback:", err.message);
    }
  }

  if (!data) {
    if (!fs.existsSync(JSON_DB_PATH)) {
      console.log("Initializing local database storage for export...");
      const initialData = {
        conversations: [
          {
            id: "conv_1",
            channelType: "twitter",
            customerName: "Alex Rivera",
            customerHandle: "@alex_dev",
            snippet: "Hey! Does Solto support single-command Docker deployment with PostgreSQL persistence?",
            unread: true,
            isListeningCaught: false,
            lastMessageAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: "conv_2",
            channelType: "email",
            customerName: "Sarah Chen",
            customerHandle: "sarah@luminahealth.io",
            snippet: "We are migrating away from Sprinklr due to excessive pricing. Can we export all historical data at any time?",
            unread: true,
            isListeningCaught: false,
            lastMessageAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: "conv_3",
            channelType: "twitter",
            customerName: "Dan K. Miller",
            customerHandle: "@techlead_dan",
            snippet: "Thinking about testing #Solto for our team's unified inbox.",
            unread: false,
            isListeningCaught: true,
            listeningKeyword: "Solto",
            lastMessageAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
        ],
        messages: [
          {
            id: "msg_1",
            conversationId: "conv_1",
            senderType: "customer",
            senderName: "Alex Rivera",
            content: "Hey! Does Solto support single-command Docker deployment with PostgreSQL persistence?",
            status: "delivered",
            createdAt: new Date().toISOString()
          },
          {
            id: "msg_2",
            conversationId: "conv_2",
            senderType: "customer",
            senderName: "Sarah Chen",
            content: "We are migrating away from Sprinklr due to excessive pricing. Can we export all historical data at any time?",
            status: "delivered",
            createdAt: new Date().toISOString()
          },
          {
            id: "msg_3",
            conversationId: "conv_3",
            senderType: "customer",
            senderName: "Dan K. Miller",
            content: "Thinking about testing #Solto for our team's unified inbox. Anyone tried their keyword listening?",
            status: "delivered",
            createdAt: new Date().toISOString()
          }
        ],
        channels: [
          { id: "chn_tw", type: "twitter", name: "Twitter/X", handle: "@solto_hq", isConnected: true },
          { id: "chn_eml", type: "email", name: "Email", handle: "support@solto.io", isConnected: true }
        ],
        keywords: [
          { id: "kw_1", keyword: "Solto", channel: "all", isActive: true, matchCount: 14 }
        ],
        scheduledPosts: []
      };
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
      data = initialData;
    } else {
      console.log("Reading from local database store:", JSON_DB_PATH);
      data = JSON.parse(fs.readFileSync(JSON_DB_PATH, "utf-8"));
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
  // 1. JSON Export
  const jsonPath = path.join(EXPORT_DIR, `solto-export-${timestamp}.json`);
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        exportMeta: {
          app: "Solto",
          exportedAt: new Date().toISOString(),
          conversationsCount: data.conversations.length,
          messagesCount: data.messages.length,
        },
        ...data,
      },
      null,
      2
    ),
    "utf-8"
  );
  console.log(`✅ Exported JSON: ${jsonPath} (${data.conversations.length} conversations, ${data.messages.length} messages)`);

  // 2. CSV Export
  const csvPath = path.join(EXPORT_DIR, `solto-export-${timestamp}.csv`);
  const headers = [
    "Conversation ID",
    "Channel",
    "Customer Name",
    "Customer Handle",
    "Caught by Listening",
    "Keyword",
    "Message ID",
    "Sender Type",
    "Sender Name",
    "Content",
    "Status",
    "Timestamp",
  ];
  const rows = [headers.join(",")];
  const convMap = new Map(data.conversations.map((c) => [c.id || c.channel_id, c]));

  for (const msg of data.messages) {
    const conv = convMap.get(msg.conversationId || msg.conversation_id);
    const line = [
      `"${msg.conversationId || msg.conversation_id}"`,
      `"${conv?.channelType || conv?.channel_type || ""}"`,
      `"${(conv?.customerName || conv?.customer_name || "").replace(/"/g, '""')}"`,
      `"${(conv?.customerHandle || conv?.customer_handle || "").replace(/"/g, '""')}"`,
      `"${(conv?.isListeningCaught || conv?.is_listening_caught) ? "Yes" : "No"}"`,
      `"${conv?.listeningKeyword || conv?.listening_keyword || ""}"`,
      `"${msg.id}"`,
      `"${msg.senderType || msg.sender_type}"`,
      `"${(msg.senderName || msg.sender_name || "").replace(/"/g, '""')}"`,
      `"${(msg.content || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${msg.status}"`,
      `"${msg.createdAt || msg.created_at}"`,
    ];
    rows.push(line.join(","));
  }
  fs.writeFileSync(csvPath, rows.join("\n"), "utf-8");
  console.log(`✅ Exported CSV:  ${csvPath}`);
  console.log("🎉 Complete! Your data remains 100% yours.");
}

runExport().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
