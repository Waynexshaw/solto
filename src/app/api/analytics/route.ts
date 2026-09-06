import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const summary = await db.getAnalyticsSummary();
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
