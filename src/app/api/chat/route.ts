import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorName, visitorEmail, message, brandId } = body;

    if (!visitorName || !message) {
      return NextResponse.json({ success: false, error: "Visitor name and message are required" }, { status: 400 });
    }

    const conversation = await db.createConversation({
      brandId: brandId || "brand_default",
      channelId: "chn_livechat",
      channelType: "livechat",
      customerName: visitorName,
      customerHandle: visitorEmail || `visitor_${Math.random().toString(36).substring(2, 6)}@livechat`,
      customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      initialMessage: message,
      snippet: message.slice(0, 100),
      isListeningCaught: false,
      isTicket: true,
      ticketStatus: "open",
      priority: "high",
      tags: ["livechat", "website-visitor"],
      unread: true,
    });

    return NextResponse.json({ success: true, conversation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
