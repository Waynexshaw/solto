import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchTwitterKeyword } from "@/lib/channels/twitter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetKeyword = body.keyword;

    const keywords = await db.getKeywords();
    const activeKeywords = targetKeyword
      ? keywords.filter((k) => k.keyword.toLowerCase() === targetKeyword.toLowerCase())
      : keywords.filter((k) => k.isActive);

    if (activeKeywords.length === 0) {
      return NextResponse.json({ success: true, message: "No active keywords to poll", addedCount: 0 });
    }

    let addedCount = 0;
    const addedConversations = [];

    for (const kw of activeKeywords) {
      const results = await searchTwitterKeyword(kw.keyword);
      for (const item of results) {
        const conv = await db.createConversation({
          channelId: "chn_twitter",
          channelType: "twitter",
          customerName: item.author.replace("@", "").replace("_", " ").toUpperCase(),
          customerHandle: item.author,
          initialMessage: item.text,
          snippet: item.text.slice(0, 100),
          isListeningCaught: true,
          listeningKeyword: kw.keyword,
          unread: true,
        });
        addedConversations.push(conv);
        addedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      addedCount,
      conversations: addedConversations,
      message: `Successfully polled ${activeKeywords.length} keywords. Found ${addedCount} matching posts.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
