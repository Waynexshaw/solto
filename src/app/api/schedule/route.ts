import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publishTwitterPost } from "@/lib/channels/twitter";
import { publishEmailBroadcast } from "@/lib/channels/email";

export async function GET() {
  try {
    const posts = await db.getScheduledPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelType, content, mediaUrl, scheduledFor, publishNow } = body;

    if (!channelType || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Channel and content are required" }, { status: 400 });
    }

    if (publishNow) {
      // Publish immediately via channel connector
      let result;
      if (channelType === "twitter") {
        result = await publishTwitterPost({ channelType, content, mediaUrl });
      } else {
        result = await publishEmailBroadcast({ channelType, content, mediaUrl });
      }

      const post = await db.addScheduledPost({
        channelType,
        content,
        mediaUrl,
        scheduledFor: new Date().toISOString(),
        status: result.success ? "published" : "failed",
        publishedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, post, publishResult: result });
    }

    // Schedule for future timestamp
    const targetDate = scheduledFor ? new Date(scheduledFor).toISOString() : new Date(Date.now() + 3600000).toISOString();
    const post = await db.addScheduledPost({
      channelType,
      content,
      mediaUrl,
      scheduledFor: targetDate,
      status: "scheduled",
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
