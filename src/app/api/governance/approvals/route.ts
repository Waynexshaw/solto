import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, feedbackNote } = body;

    if (!id || !action || (action !== "approved" && action !== "rejected")) {
      return NextResponse.json({ success: false, error: "Approval ID and valid action required" }, { status: 400 });
    }

    const reviewed = await db.reviewApprovalItem(id, action, feedbackNote);
    return NextResponse.json({ success: true, item: reviewed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
