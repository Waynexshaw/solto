import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel") || undefined;
    const unreadOnly = searchParams.get("unread") === "true";
    const listeningOnly = searchParams.get("listening") === "true";

    const conversations = await db.getConversations({
      channel,
      unreadOnly,
      listeningOnly,
    });

    return NextResponse.json({ success: true, conversations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelId, channelType, customerName, customerHandle, initialMessage, isListeningCaught, listeningKeyword } = body;

    if (!channelId || !channelType || !customerName || !customerHandle || !initialMessage) {
      return NextResponse.json({ success: false, error: "Missing required conversation fields" }, { status: 400 });
    }

    const conversation = await db.createConversation({
      channelId,
      channelType,
      customerName,
      customerHandle,
      initialMessage,
      isListeningCaught: !!isListeningCaught,
      listeningKeyword: listeningKeyword || undefined,
      unread: true,
      snippet: initialMessage.slice(0, 100),
    });

    return NextResponse.json({ success: true, conversation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
