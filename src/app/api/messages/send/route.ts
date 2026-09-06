import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmailMessage } from "@/lib/channels/email";
import { sendTwitterReply } from "@/lib/channels/twitter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, content, mediaUrls } = body;

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Missing conversationId or message content" }, { status: 400 });
    }

    const conversation = await db.getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    // Actually dispatch to the channel API
    let sendResult;
    if (conversation.channelType === "twitter") {
      sendResult = await sendTwitterReply({
        toHandleOrEmail: conversation.customerHandle,
        content,
        mediaUrls,
      });
    } else {
      sendResult = await sendEmailMessage({
        toHandleOrEmail: conversation.customerHandle,
        content,
        mediaUrls,
      });
    }

    // Persist sent message
    const savedMessage = await db.addMessage({
      conversationId,
      senderType: "agent",
      senderName: "Solto Support",
      senderHandle: conversation.channelType === "twitter" ? "@solto_hq" : "support@solto.io",
      content,
      mediaUrls,
      channelMessageId: sendResult.channelMessageId,
      status: sendResult.success ? "delivered" : "failed",
    });

    // Mark conversation read
    await db.markConversationRead(conversationId);

    return NextResponse.json({
      success: true,
      message: savedMessage,
      dispatch: sendResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
