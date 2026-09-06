import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const channels = await db.getChannels();
    return NextResponse.json({ success: true, channels });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, handle, isConnected, credentials } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Channel ID required" }, { status: 400 });
    }

    const updated = await db.updateChannel(id, {
      handle,
      isConnected,
      credentials,
    });

    return NextResponse.json({ success: true, channel: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
