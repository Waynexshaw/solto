import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ success: true, isCompliant: true, flaggedWords: [] });
    }

    const check = await db.checkCompliance(content);
    return NextResponse.json({ success: true, ...check });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
