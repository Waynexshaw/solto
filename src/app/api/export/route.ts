import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const data = await db.getAllDataForExport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    if (format.toLowerCase() === "csv") {
      // Build flattened CSV of Conversations & Messages
      const headers = [
        "Conversation ID",
        "Channel Type",
        "Customer Name",
        "Customer Handle",
        "Caught by Listening",
        "Listening Keyword",
        "Message ID",
        "Sender Type",
        "Sender Name",
        "Message Content",
        "Message Status",
        "Message Timestamp",
      ];

      const rows: string[] = [headers.join(",")];

      const conversationMap = new Map(data.conversations.map((c) => [c.id, c]));

      for (const msg of data.messages) {
        const conv = conversationMap.get(msg.conversationId);
        const row = [
          escapeCsvField(msg.conversationId),
          escapeCsvField(conv?.channelType || "unknown"),
          escapeCsvField(conv?.customerName || ""),
          escapeCsvField(conv?.customerHandle || ""),
          escapeCsvField(conv?.isListeningCaught ? "Yes" : "No"),
          escapeCsvField(conv?.listeningKeyword || ""),
          escapeCsvField(msg.id),
          escapeCsvField(msg.senderType),
          escapeCsvField(msg.senderName),
          escapeCsvField(msg.content),
          escapeCsvField(msg.status),
          escapeCsvField(msg.createdAt),
        ];
        rows.push(row.join(","));
      }

      const csvContent = rows.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="solto-export-${timestamp}.csv"`,
        },
      });
    }

    // Default JSON export
    const jsonOutput = JSON.stringify(
      {
        exportMeta: {
          app: "Solto",
          exportedAt: new Date().toISOString(),
          version: "0.1.0-phase0",
          stats: {
            conversationsCount: data.conversations.length,
            messagesCount: data.messages.length,
            channelsCount: data.channels.length,
          },
        },
        ...data,
      },
      null,
      2
    );

    return new NextResponse(jsonOutput, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="solto-export-${timestamp}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
